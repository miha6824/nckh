import React, { useState, useEffect, useRef } from 'react';
import UserNavbar from '../Navbar/UserNavbar';
import axios from 'axios';
import Webcam from 'react-webcam';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './UploadPhotoPage.module.css';
import DefaultAvatar from '../../assets/avatarinUploadpage.png';
import * as faceapi from 'face-api.js'; // Import face-api.js

const UploadPhotoPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });
    const [error, setError] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [userImages, setUserImages] = useState([]);
    const [showModal, setShowModal] = useState(false); // State để hiển thị modal ảnh vừa chụp
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

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
        // Load các model của face-api.js khi component mount
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
            } catch (error) {
                console.error('Error loading models:', error);
            }
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

    const startFaceDetection = () => {
        const webcamInstance = webcamRef.current;

        if (!webcamInstance || !webcamInstance.video) {
            console.error('Webcam reference is not yet available.');
            return;
        }

        const videoEl = webcamInstance.video;

        videoEl.addEventListener('play', async () => {
            const canvas = faceapi.createCanvasFromMedia(videoEl);
            canvasRef.current.innerHTML = ''; // Xóa các canvas cũ trước khi thêm mới
            canvasRef.current.appendChild(canvas);
            const displaySize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            // Bắt đầu nhận diện khuôn mặt và vẽ lên canvas
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }, 100);
        });
    };

    const handleCaptureClick = () => {
        setShowCamera(true);
        setTimeout(startFaceDetection, 100); // Đợi 1 giây sau khi hiển thị camera để bắt đầu nhận diện khuôn mặt
    };

    const handleCapturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setShowCamera(false); // Tắt camera khi đã chụp ảnh
        setShowModal(true); // Hiển thị modal ảnh vừa chụp
    };

    useEffect(() => {
        // Khi capturedImage thay đổi, nhận diện khuôn mặt trên ảnh và vẽ lên canvas
        if (capturedImage) {
            detectAndDrawFaces();
        }
    }, [capturedImage]);

    const detectAndDrawFaces = async () => {
        const img = new Image();
        img.src = capturedImage;
        await img.onload;

        const canvas = faceapi.createCanvasFromMedia(img);
        canvasRef.current.innerHTML = ''; // Xóa các canvas cũ trước khi thêm mới
        canvasRef.current.appendChild(canvas);
        const displaySize = { width: img.width, height: img.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userID = localStorage.getItem('ID_user');

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                setCapturedImage(null); // Đặt capturedImage về null để đóng modal
                setShowModal(false); // Đóng modal
                fetchUserImages(userID);
            })
            .catch(err => {
                setError(err.response ? err.response.data : "Lỗi khi upload hình ảnh");
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

    const sliderSettings = {
        dots: true,
        infinite: true,
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
            <UserNavbar className={styles.navbar} />
            <div className={styles.profilePage}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.placeholderAvatar}><img src={DefaultAvatar} alt="Default Avatar" className={styles.Avatar} /></div>
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
                                <div className={styles.formGroup}>
                                    <label htmlFor="image" className={styles.formLabel}>Hình ảnh</label>
                                    <input type="file" id="image" name="image" onChange={handleChange} className={styles.formControl} accept=".png" required />
                                    <button type="button" onClick={handleCaptureClick} className={styles.captureButton}>Chụp ảnh</button>
                                </div>
                                <button type="submit" className={styles.submitButton}>Tải lên</button>
                            </form>
                            {error && <div className={styles.alert}>{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
                        </div>
                    </div>
                </div>

                <div className={styles.cameraContainer}>
                    {showCamera && (
                        <div className={styles.cameraOverlay}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                className={styles.webcam}
                            />
                            <div ref={canvasRef} className={styles.canvasOverlay}></div>
                            <button onClick={handleCapturePhoto} className={styles.captureButton}>Chụp</button>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
                            <button onClick={handleSubmit} className={styles.saveButton}>Lưu</button>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>Đóng</button>
                        </div>
                    </div>
                )}

                <div className={styles.userImages}>
                    <h3>Danh sách ảnh của bạn</h3>
                    {userImages.length === 0 ? (
                        <p>Bạn chưa có ảnh nào.</p>
                    ) : (
                        <Slider {...sliderSettings}>
                            {userImages.map(image => (
                                <div key={image.ID} className={styles.imageItem}>
                                    <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} className={styles.userImage} />
                                    <button onClick={() => handleDeleteImage(image.ID)} className={styles.deleteButton}>X</button>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadPhotoPage;
