import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    // Function to handle redirect to register page
    const handleRegisterRedirect = () => {
        // Redirect logic here
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Đăng Nhập</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email của bạn" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu của bạn" />
                    </div>
                    <button type="submit"><Link to="/home">Đăng Nhập</Link></button>
                </form>
                <p>Bạn chưa có tài khoản? <Link to="/register">Đăng kí ngay</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
