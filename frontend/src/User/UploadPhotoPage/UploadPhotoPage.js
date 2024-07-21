import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './UploadPhotoPage.module.css';
import DefaultAvatar from '../../assets/avatarinUploadpage.png';
import * as faceapi from 'face-api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const UploadPhotoPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });
    const [error, setError] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [userImages, setUserImages] = useState([]);
    const [faceDetectionResult, setFaceDetectionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadStage, setUploadStage] = useState(0); // 0 = Không tải, 1 = Tìm khuôn mặt, 2 = Tải thành công
    const webcamRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userID = localStorage.getItem('ID_user');
            if (!userID) {
                setError("Không tìm thấy User ID trong localStorage");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8081/userInfo4AddImgUserSite/${userID}`);
                const userInfo = res.data;
                setFormData({
                    username: userInfo.FullName,
                    id_user: userInfo.ID
                });
                fetchUserImages(userID);
            } catch (err) {
                setError(err.response ? err.response.data : "Lỗi khi lấy dữ liệu người dùng");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const loadModels = async () => {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            ]);
            console.log("Models loaded");
        };

        loadModels();
    }, []);

    const fetchUserImages = async (userID) => {
        try {
            const res = await axios.get(`http://localhost:8081/userImages/${userID}`);
            setUserImages(res.data);
        } catch (err) {
            console.error("Error fetching user images:", err);
            setError(err.response ? err.response.data : "Lỗi khi lấy danh sách ảnh của người dùng");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userID = localStorage.getItem('ID_user');

        setLoading(true);
        setUploadStage(1); // Bắt đầu tìm khuôn mặt

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                setUploadStage(2); // Đã tải ảnh thành công
                fetchUserImages(userID);
                setSuccessMessage("Ảnh đã tải thành công!");
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000); // Ẩn thông báo sau 3 giây
            })
            .catch(err => {
                if (err.response && err.response.data.error === "No face detected") {
                    setError("Không phát hiện được khuôn mặt trong ảnh. Vui lòng chọn ảnh khác.");
                    setUploadStage(0); // Quay lại trạng thái ban đầu
                } else {
                    console.error("Lỗi khi upload ảnh:", err);
                    console.error("Response data:", err.response.data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCaptureClick = () => {
        setCameraActive(true);
    };

    const handleCapturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setCameraActive(false);

        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'captured.png', { type: 'image/png' });
                setFormData({ ...formData, image: file });
            });
    };

    const handleSaveCapturedImage = () => {
        const userID = localStorage.getItem('ID_user');

        setLoading(true);
        setUploadStage(1); // Bắt đầu tìm khuôn mặt

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                setCapturedImage(null);
                fetchUserImages(userID);
                setUploadStage(2); // Đã tải ảnh thành công
                setSuccessMessage("Ảnh đã tải thành công!");
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000); // Ẩn thông báo sau 3 giây
            })
            .catch(err => {
                setError(err.response ? err.response.data : "Lỗi khi upload hình ảnh");
                setUploadStage(0); // Quay lại trạng thái ban đầu
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteImage = async (imageID) => {
        try {
            const userID = localStorage.getItem('ID_user');
            await axios.delete(`http://localhost:8081/deleteUserImage/${userID}/${imageID}`);
            fetchUserImages(userID);
        } catch (err) {
            console.error("Error deleting image:", err);
            setError(err.response ? err.response.data : "Lỗi khi xóa hình ảnh");
        }
    };

    useEffect(() => {
        const detectFaceInVideo = async () => {
            if (webcamRef.current && cameraActive) {
                const video = webcamRef.current.video;
                const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

                if (result) {
                    const detectionPercentage = Math.round(result.detection._score * 100);
                    setFaceDetectionResult(detectionPercentage);
                } else {
                    setFaceDetectionResult(null);
                }
            }
        };

        const interval = setInterval(() => {
            detectFaceInVideo();
        }, 1000);

        return () => clearInterval(interval);
    }, [cameraActive]);

    const renderUserImages = () => {
        if (userImages.length === 0) {
            return <p>Bạn chưa có ảnh nào.</p>;
        } else if (userImages.length > 4) {
            return (
                <Slider {...sliderSettings}>
                    {userImages.map(image => (
                        <div key={image.ID} className={styles.imageItem}>
                            <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} className={styles.userImage} />
                            <button type="button" onClick={() => handleDeleteImage(image.ID)} className={styles.deleteButton}>X</button>
                        </div>
                    ))}
                </Slider>
            );
        } else {
            return (
                <div className={styles.imageGrid}>
                    {userImages.map(image => (
                        <div key={image.ID} className={styles.imageItem}>
                            <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} className={styles.userImage} />
                            <button type="button" onClick={() => handleDeleteImage(image.ID)} className={styles.deleteButton}>X</button>
                        </div>
                    ))}
                </div>
            );
        }
    };

    const sliderSettings = {
        dots: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} ${styles.customArrow}`}
                style={{ ...style, display: 'block' }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} ${styles.customArrow}`}
                style={{ ...style, display: 'block' }}
                onClick={onClick}
            />
        );
    }

    return (
        <div>
            <div className={styles.profilePage}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.placeholderAvatar}>
                            <img src={DefaultAvatar} alt="Default Avatar" className={styles.Avatar} />
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <h2 className={styles.username}>{formData.username}</h2>
                        <p className={styles.userId}>ID: {formData.id_user}</p>
                    </div>
                </div>
                <div className={styles.uploadSection}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Tải lên ảnh mới</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="image" className={styles.formLabel}>Hình ảnh</label>
                                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                                <div className={styles.formGroup}>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleChange}
                                        className={styles.formControl}
                                        accept="*"
                                        required
                                    />
                                    <button type="submit" className={styles.submitButton} disabled={loading}>
                                        {loading ? 'Đang tải...' : 'Tải lên'}
                                    </button>
                                </div>
                                <div className={styles.buttonContainer}>
                                    <button
                                        type="button"
                                        onClick={handleCaptureClick}
                                        className={styles.captureButton}
                                    >
                                        Chụp ảnh
                                    </button>
                                </div>
                            </form>
                            {error && <div className={styles.alert}>{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
                        </div>
                    </div>
                    {loading && (
                        <div className={styles.overlay}>
                            <div className={styles.spinner}>
                                {uploadStage === 1 && (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                                        <p>Đang tìm khuôn mặt...</p>
                                    </>
                                )}
                                {uploadStage === 2 && (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                                        <p>Ảnh đã tải thành công!</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {cameraActive && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <span onClick={() => setCameraActive(false)} className={styles.closeIcon}>X</span>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                className={styles.webcam}
                            />
                            {faceDetectionResult !== null && (
                                <div className={styles.faceDetection}>
                                    Phần trăm nhận diện khuôn mặt: {faceDetectionResult}%
                                </div>
                            )}
                            <button onClick={handleCapturePhoto} className={styles.captureButton}>Chụp</button>
                        </div>
                    </div>
                )}
                {capturedImage && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.capturedImageContainer}>
                                <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
                                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                                {loading && (
                                    <div className={styles.overlay}>
                                        <div className={styles.spinner}>
                                            {uploadStage === 1 && (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                                                    <p>Đang tìm khuôn mặt...</p>
                                                </>
                                            )}
                                            {uploadStage === 2 && (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                                                    <p>Ảnh đã tải thành công!</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSaveCapturedImage} className={styles.saveButton}>Lưu</button>
                            <button onClick={() => setCapturedImage(null)} className={styles.closeButton}>Đóng</button>
                        </div>
                    </div>
                )}

                <div className={styles.userImages}>
                    <h2>Danh sách hình ảnh</h2>
                    {renderUserImages()}
                </div>
            </div>
        </div>
    );

};

export default UploadPhotoPage;
