import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        fullName: '',
        sex: '',
        birthday: '',
        telephone: '',
        address: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePhoneNumberInput = (e) => {
        const newValue = e.target.value.replace(/\D/g, '');
        setValues({ ...values, telephone: newValue });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const currentDate = new Date();
        const dobDate = new Date(values.birthday);
        if (dobDate > currentDate) {
            alert('Ngày sinh không được lớn hơn ngày hiện tại');
            return;
        }
        axios.post('http://localhost:8081/register', values)
            .then(res => {
                setMessage(res.data);
                alert('Đăng ký thành công');
                navigate('/login');
            })
            .catch(err => {
                if (err.response) {
                    setMessage(err.response.data);
                } else {
                    setMessage("Error");
                }
            });
    };

    return (
        <div className={styles.background}>
            <div className={styles.registerContainer}>
                <h2 className={styles.title}>Đăng Ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email"><strong>Email</strong></label>
                                <input type="email" placeholder='Nhập Email' name='email'
                                    onChange={e => setValues({ ...values, email: e.target.value })} className={styles.formControl}></input>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password"><strong>Mật khẩu</strong></label>
                                <input type="password" placeholder='Nhập Mật khẩu' name='password'
                                    onChange={e => setValues({ ...values, password: e.target.value })} className={styles.formControl}></input>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="fullName"><strong>Họ và tên</strong></label>
                                <input type="text" placeholder='Nhập Họ và tên' name='fullName'
                                    onChange={e => setValues({ ...values, fullName: e.target.value })} className={styles.formControl}></input>
                            </div>
                        </div>
                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label htmlFor="birthday"><strong>Ngày sinh</strong></label>
                                <input type="date" name='birthday'
                                    onChange={e => setValues({ ...values, birthday: e.target.value })} className={styles.formControl}></input>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="telephone"><strong>Số điện thoại</strong></label>
                                <input type="number" placeholder='Nhập Số điện thoại' name='telephone'
                                    onChange={handlePhoneNumberInput} className={styles.formControl}></input>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address"><strong>Địa chỉ</strong></label>
                                <input type="text" placeholder='Nhập Địa chỉ' name='address'
                                    onChange={e => setValues({ ...values, address: e.target.value })} className={styles.formControl}></input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="sex"><strong>Giới tính</strong></label>
                        <select
                            name="sex"
                            onChange={e => setValues({ ...values, sex: e.target.value })}
                            className={styles.formControl}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <button type='submit' className={styles.btnPrimary}>Sign Up</button>
                    <Link to='/login' className={styles.btnSecondary}>Sign In</Link>
                    {message && <p className={styles.message}>{message}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
