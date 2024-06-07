import React, { useState, useEffect } from 'react';
import UserNavbar from '../Navbar/UserNavbar';
import axios from 'axios';
import styles from './UploadPhotoPage.module.css';

const UploadPhotoPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userID = localStorage.getItem('ID_user'); // Lấy ID người dùng từ localStorage
            console.log("Fetching data for userID:", userID);

            if (!userID) {
                setError("Không tìm thấy User ID trong localStorage");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8081/userInfo4AddImgUserSite/${userID}`);
                console.log("User data fetched from server:", res.data);

                const userInfo = res.data;
                setFormData({
                    username: userInfo.FullName,
                    id_user: userInfo.ID
                });
            } catch (err) {
                setError(err.response ? err.response.data : "Lỗi khi lấy dữ liệu người dùng");
                console.log("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []); // Sử dụng mảng rỗng để chỉ chạy useEffect một lần sau khi component được render

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
        console.log("Submitting form for userID:", userID);

        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        console.log("Form data being sent:", {
            username: formData.username,
            image: formData.image,
            id_user: formData.id_user
        });

        axios.post(`http://localhost:8081/ImgUserAddUserSite/${userID}`, data)
            .then(res => {
                console.log("Image upload response:", res.data);
            })
            .catch(err => {
                console.error("Error uploading image:", err);
                console.error("Response data:", err.response ? err.response.data : null);
                setError(err.response ? err.response.data : "Lỗi khi upload hình ảnh");
            });
    };

    return (
        <div className={styles.uploadPhotoPage}>
            <UserNavbar className={styles.navbar} />
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
        </div>
    );
}

export default UploadPhotoPage;
