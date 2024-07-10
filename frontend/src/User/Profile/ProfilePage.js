import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../Navbar/UserNavbar';
import DefaultAvatar from '../../assets/avatarinUploadpage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userID = localStorage.getItem('ID_user');
            if (!userID) {
                setError("Không tìm thấy User ID trong localStorage");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8081/user/${userID}`);
                const PreUserInfo = res.data;
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
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
        } else {
            setConfirmPassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp, vui lòng nhập lại');
            return;
        }

        try {
            await axios.put(`http://localhost:8081/change_password/${localStorage.getItem('ID_user')}`, { password });
            alert('Đổi mật khẩu thành công');
            setShowChangePassword(false);
        } catch (err) {
            console.log(err);
            alert('Có lỗi khi đổi mật khẩu');
        }
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div>
            <div className={styles.profileContainer}>
                <div className={styles.backButton} onClick={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h2 className={styles.profileTitle}>Thông tin cá nhân</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.placeholderAvatar}><img src={DefaultAvatar} alt="Default Avatar" className={styles.avatar} /></div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            disabled
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
                        </select>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>Lưu thông tin</button>
                        <button type="button" className={styles.changePasswordButton} onClick={() => setShowChangePassword(true)}>Đổi mật khẩu</button>
                    </div>
                </form>
                {showChangePassword && (
                    <div className={styles.overlay}>
                        <form onSubmit={handlePasswordSubmit} className={styles.changePasswordForm}>
                            <h3>Đổi mật khẩu</h3>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    className={styles.formInput}
                                    disabled
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={styles.formInput}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nhập lại mật khẩu:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handlePasswordChange}
                                    className={styles.formInput}
                                    required
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.submitButton}>Đổi mật khẩu</button>
                                <button type="button" className={styles.cancelButton} onClick={() => setShowChangePassword(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
