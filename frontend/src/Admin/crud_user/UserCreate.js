import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './UserCreate.module.css'; // Import the CSS for styling

function UserCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        sex: '',
        dob: '',
        phoneNumber: '',
        address: '',
        id_departments: '',
        hsl: ''
    });
    const [departments, setDepartments] = useState([]);
    const [salaryScales, setSalaryScales] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/HSLuong')
            .then(res => setSalaryScales(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_user', formData)
            .then(res => {
                console.log('Response:', res.data); // Log successful response
                alert('Thêm người dùng thành công'); // Display success alert
                navigate('/CRUD_User');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Thêm người không thành công');// Log error for debugging
            });
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.userCreateContainer}> {/* Use the same container class */}
                        <h2>Create User</h2>
                        <form onSubmit={handleSubmit} className="row">
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
                                    <label>Full Name:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giới tính:</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option>Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth:</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Phone Number:</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phòng ban:</label>
                                    <select
                                        name="id_departments"
                                        value={formData.id_departments}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option>Chọn phòng ban</option>
                                        {departments.map(dept => (
                                            <option key={dept.ID} value={dept.ID}>
                                                {dept.TenPhongBan}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Hệ số lương:</label>
                                    <select
                                        name="hsl"
                                        value={formData.hsl}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        {salaryScales.map(salary => (
                                            <option key={salary.HSLuong} value={salary.HSLuong}>
                                                {salary.HSLuong}
                                            </option>
                                        ))}
                                    </select>
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

export default UserCreate;

