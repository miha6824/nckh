import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './UpdateAccount.module.css';

function UpdateAccount() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        id_user: '',
        role: '',
    });

    const [fullName, setFullName] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/account/${id}`)
            .then(res => {
                const PreAccountInfo = res.data;
                setFormData({
                    email: PreAccountInfo.Email,
                    password: PreAccountInfo.Password,
                    id_user: PreAccountInfo.ID_User,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/update_account/${id}`, formData)
            .then(res => {
                console.log(res.data);
                alert('Thay đổi thành công');
                navigate('/CRUD_Account');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className={styles.accountUpdateContainer}>
            <h2>Cập nhật người dùng</h2>
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Chủ sở hữu tài khoản</label>
                        <input
                            type="text"
                            name="id_user"
                            value={fullName}
                            onChange={handleChange}
                            required
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Role:</label>
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
