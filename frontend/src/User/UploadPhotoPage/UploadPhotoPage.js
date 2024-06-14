import React, { useState, useEffect, useRef } from 'react';
import UserNavbar from '../Navbar/UserNavbar';
import axios from 'axios';
import Webcam from 'react-webcam';
import Slider from 'react-slick'; // Import Slider component from react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './UploadPhotoPage.module.css';

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

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                fetchUserImages(userID);
            })
            .catch(err => {
                setError(err.response ? err.response.data : "Lỗi khi upload hình ảnh");
            });
    };

    const handleCaptureClick = () => {
        setShowCamera(true);
    };

    const handleCapturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setShowCamera(false);

        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'captured.png', { type: 'image/png' });
                setFormData({ ...formData, image: file });
            });
    };

    const handleSaveCapturedImage = () => {
        const userID = localStorage.getItem('ID_user');

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                setCapturedImage(null);
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

    // Cấu hình Slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Hiển thị tối đa 4 ảnh cùng một lúc
        slidesToScroll: 4 // Chuyển đổi 4 ảnh mỗi lần
    };

    return (
        <div>
            <UserNavbar className={styles.navbar} />
            <div className={styles.uploadPhotoPage}>
                <div className={styles.content}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Create User</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="username" className={styles.formLabel}>Họ và tên</label>
                                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={styles.formControl} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="image" className={styles.formLabel}>Hình ảnh</label>
                                    <input type="file" id="image" name="image" onChange={handleChange} className={styles.formControl} accept=".png" required />
                                    <button type="button" onClick={handleCaptureClick} className={styles.captureButton}>Chụp ảnh</button>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="id_user" className={styles.formLabel}>ID_User</label>
                                    <input type="text" id="id_user" name="id_user" value={formData.id_user} onChange={handleChange} className={styles.formControl} required />
                                </div>
                                <button type="submit" className={styles.submitButton}>Create</button>
                            </form>
                            {error && <div className={styles.alert}>{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
                        </div>
                    </div>
                </div>

                {showCamera && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                className={styles.webcam}
                            />
                            <button onClick={handleCapturePhoto} className={styles.captureButton}>Chụp</button>
                        </div>
                    </div>
                )}

                {capturedImage && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
                            <button onClick={handleSaveCapturedImage} className={styles.saveButton}>Lưu</button>
                            <button onClick={() => setCapturedImage(null)} className={styles.closeButton}>Đóng</button>
                        </div>
                    </div>
                )}

                {/* Hiển thị tất cả các ảnh của người dùng */}
                <div className={styles.userImages}>
                    <h3>Danh sách ảnh của bạn</h3>
                    <Slider {...sliderSettings}>
                        {userImages.map(image => (
                            <div key={image.ID} className={styles.imageItem}>
                                <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} className={styles.userImage} />
                                <button onClick={() => handleDeleteImage(image.ID)} className={styles.deleteButton}>X</button>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default UploadPhotoPage;
