import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CreateAccount.module.css'; // Import the CSS for styling

function CreateAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        id_user: '',
        role: '',
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_User')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUserChange = (e) => {
        const selectedUserId = e.target.value;
        const selectedUser = users.find(user => user.ID === parseInt(selectedUserId));

        if (selectedUser) {
            setFormData({
                ...formData,
                id_user: selectedUserId,
                email: selectedUser.Email,
            });
        } else {
            setFormData({
                ...formData,
                id_user: '',
                email: '',
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_account', formData)
            .then(res => {
                console.log('Response:', res.data); // Log successful response
                alert('Thêm tài khoản thành công'); // Display success alert
                navigate('/CRUD_Account');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Thêm tài khoản thất bại');// Log error for debugging
            });
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.accountCreateContainer}> {/* Use the same container class */}
                        <h2>Tạo tài khoản</h2>
                        <form onSubmit={handleSubmit} className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>ID_User:</label>
                                    <select
                                        name="id_user"
                                        value={formData.id_user}
                                        onChange={handleUserChange}
                                        required
                                        className="form-control"
                                    >
                                        <option>Chọn nhân viên</option>
                                        {users.map(user => (
                                            <option key={user.ID} value={user.ID}>
                                                {user.ID} - {user.FullName}
                                            </option>
                                        ))}
                                    </select>
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
                                        readOnly // Make the email field read-only
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
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;
