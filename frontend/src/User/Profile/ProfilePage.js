import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './ProfilePage.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        fullName: '',
        dob: '',
        phoneNumber: '',
        address: '',
        gender: '',
        avatar: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic để lưu thông tin người dùng
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h2>Thông tin cá nhân</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={userInfo.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input type="text" name="fullName" value={userInfo.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input type="date" name="dob" value={userInfo.dob} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="tel" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" name="address" value={userInfo.address} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Giới tính:</label>
                        <select name="gender" value={userInfo.gender} onChange={handleChange} required>
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <button type="submit">Lưu thông tin</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
