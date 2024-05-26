import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from '../Navbar/UserNavbar';
import './ProfilePage.css';

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
                setUserInfo(res.data);
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
            [name]: value
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
            <div className="profile-container">
                <h2>Thông tin cá nhân</h2>
                {error && <p className="error-message">{error}</p>}
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
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <button type="submit">Lưu thông tin</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
