import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './UpdateAccount.module.css';

function UpdateAccount() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '',
    });

    const [fullName, setFullName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/account/${id}`)
            .then(res => {
                const PreAccountInfo = res.data;
                setFormData({
                    email: PreAccountInfo.Email,
                    password: PreAccountInfo.Password,
                    role: PreAccountInfo.Role,
                });

                // Fetch full name for the given ID_User
                axios.get(`http://localhost:8081/user/${PreAccountInfo.ID_User}`)
                    .then(res => {
                        setFullName(res.data.FullName);
                    })
                    .catch(err => console.log('Error fetching full name:', err));
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { email, password, role } = formData;

        // Kiểm tra role hợp lệ
        if (role !== 'user' && role !== 'admin') {
            setErrorMessage('Vai trò không hợp lệ. Vai trò chỉ có thể là "user" hoặc "admin".');
            return false;
        }

        // Kiểm tra mật khẩu không chứa ký tự tiếng Việt hoặc dấu
        const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
        if (vietnamesePattern.test(password)) {
            setErrorMessage('Mật khẩu không được chứa các ký tự tiếng Việt hoặc dấu.');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        axios.put(`http://localhost:8081/update_account/${id}`, formData)
            .then(res => {
                console.log(res.data);
                alert('Thay đổi thành công');
                navigate('/CRUD_Account');
            })
            .catch(err => {
                console.log(err);
                setErrorMessage('Có lỗi xảy ra trong quá trình cập nhật tài khoản.');
            });
    };
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.accountUpdateContainer}>
            <div className={styles.backButton} onClick={handleGoBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <h2>Cập nhật người dùng</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Chủ sở hữu tài khoản</label>
                        <input
                            type="text"
                            name="fullName"
                            value={fullName}
                            required
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Vai trò:</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateAccount;
