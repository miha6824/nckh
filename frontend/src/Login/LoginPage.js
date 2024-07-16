import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.message === "Đăng nhập thành công") {
                    localStorage.setItem('ID_user', res.data.userData.ID);
                    const role = values.email === 'admin1@gmail.com' ? 'admin' : 'user';
                    if (role === 'admin') {
                        navigate('/FormReportComponent');
                    } else if (role === 'user') {
                        navigate('/home');
                    }
                } else {
                    setError("Sai tài khoản hoặc mật khẩu");
                }
            })
            .catch(err => {
                console.log(err);
                setError("Sai tài khoản hoặc mật khẩu");
            });
    };

    return (
        <div className={styles.background}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>Đăng Nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email của bạn"
                            onChange={e => setValues({ ...values, email: e.target.value })} className={styles.formControl} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu của bạn"
                            onChange={e => setValues({ ...values, password: e.target.value })} className={styles.formControl} />
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    <button type='submit' className={styles.btnPrimary}>Đăng nhập</button>
                    <Link to={'/register'} className={styles.btnSecondary}>Đăng kí</Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
