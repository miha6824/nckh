import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './AddImageToUser.module.css';

function AddImageToUser() {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadStage, setUploadStage] = useState(0); // 0 = Không tải, 1 = Tìm khuôn mặt, 2 = Tải thành công

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/userInfo4AddImg/${id}`)
            .then(res => {
                const userInfo = res.data;
                setFormData({
                    ...formData,
                    username: userInfo.UserName,
                    id_user: userInfo.ID_User
                });
            })
            .catch(err => {
                console.error("Error fetching user info:", err);
            });
    }, [id]);

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadStage(1);
        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post(`http://localhost:8081/ImgUserAdd/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setUploadStage(2); // Đã tải ảnh thành công
                setSuccessMessage("Ảnh đã tải thành công!");
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            })
            .catch(err => {
                if (err.response && err.response.data.error === "No face detected") {
                    setErrorMessage("Không phát hiện được khuôn mặt trong ảnh. Vui lòng chọn ảnh khác.");
                    setUploadStage(0);
                } else {
                    console.error("Error uploading image:", err);
                    console.error("Response data:", err.response.data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleGoBack = () => {
        navigate('/CRUD_ImgUser');
    };

    return (
        <div className={styles.imgAddContainer}>
            <div className="card-header">
                <div className={styles.backButton} onClick={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2 className="card-title">Thêm ảnh cho người dùng</h2>
            </div>
            <div className="card-body">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Họ và tên</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control" disabled />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="image" className="form-label">Hình ảnh</label>
                        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                        <input type="file" id="image" name="image" onChange={handleChange} className="form-control" accept="*" required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="id_user" className="form-label">ID_User</label>
                        <input type="text" id="id_user" name="id_user" value={formData.id_user} onChange={handleChange} className="form-control" disabled />
                    </div>
                    <button type="submit" className="btn btn-primary">Tạo mới</button>
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
                </form>
            </div>
        </div>
    );
}

export default AddImageToUser;
