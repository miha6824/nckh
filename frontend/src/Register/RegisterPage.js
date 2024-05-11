import React from 'react';
import './style.css'; // Import CSS file
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-form">
                    <div className="column">
                        <label htmlFor="email">Email:</label>
                        <input type="email" />
                        <label htmlFor="email">Mật khẩu:</label>
                        <input type="password" />
                        <label htmlFor="email">Xác nhận mật khẩu:</label>
                        <input type="password" />
                        <div className="gender-radio">
                            <label>Giới tính:</label>
                            <div className="radio-buttons">
                                <input type="radio" id="male" name="gender" value="male" />
                                <label htmlFor="male">Nam</label>
                                <input type="radio" id="female" name="gender" value="female" />
                                <label htmlFor="female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <label htmlFor="email">Họ và tên:</label>
                        <input type="text" />
                        <label htmlFor="email">Ngày sinh</label>
                        <input type="date" />
                        <label htmlFor="email">Số điện thoại:</label>
                        <input type="tel" />
                        <label htmlFor="email">Địa chỉ:</label>
                        <input type="text" />
                    </div>
                </div>
                <div className="button-container">
                    <button className="register-button">Đăng ký</button>
                    <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </div>
            </div>
        </div>

    );
};

export default RegisterPage;
