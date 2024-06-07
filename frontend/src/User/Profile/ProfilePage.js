import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from '../Navbar/UserNavbar';
import styles from './ProfilePage.module.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        fullName: '',
        dob: '',
        phoneNumber: '',
        address: '',
        gender: ''
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userID = localStorage.getItem('ID_user');// Lấy ID người dùng từ localStorage
            if (!userID) {
                setError("Không tìm thấy User ID trong localStorage");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8081/user/${userID}`);
                const PreUserInfo = res.data;
                console.log(PreUserInfo);
                setUserInfo({
                    email: PreUserInfo.Email,
                    fullName: PreUserInfo.FullName,
                    dob: new Date(PreUserInfo.BirthDay).toISOString().split('T')[0],
                    phoneNumber: PreUserInfo.Telephone,
                    address: PreUserInfo.Address,
                    gender: PreUserInfo.Sex
                });

            } catch (err) {
                setError(err.response ? err.response.data : "Lỗi khi lấy dữ liệu người dùng");
                console.log(err);
            }
        };

        fetchUserData();
    }, []); // Sử dụng mảng rỗng để chỉ chạy useEffect một lần sau khi component được render

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem có trường nào bị trống không
        for (const key in userInfo) {
            if (!userInfo[key]) {
                alert('Vui lòng điền đầy đủ thông tin');
                return;
            }
        }

        try {
            await axios.put(`http://localhost:8081/update_profile/${localStorage.getItem('ID_user')}`, userInfo);
            alert('Cập nhật thông tin thành công');
        } catch (err) {
            console.log(err);
            alert('Có lỗi khi cập nhật thông tin');
        }
    };

    return (
        <div>
            <UserNavbar /> {/* Hiển thị navbar ở đây nếu cần */}
            <div className={styles.profileContainer}>
                <h2 className={styles.profileTitle}>Thông tin cá nhân</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={userInfo.fullName}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ngày sinh:</label>
                        <input
                            type="date"
                            name="dob"
                            value={userInfo.dob}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Số điện thoại:</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={userInfo.address}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Giới tính:</label>
                        <select
                            name="gender"
                            value={userInfo.gender}
                            onChange={handleChange}
                            className={styles.formSelect}
                            required
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.submitButton}>Lưu thông tin</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
