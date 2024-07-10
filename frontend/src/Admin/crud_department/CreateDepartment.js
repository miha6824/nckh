import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CreateDepartment.modul.css';

function CreateDepartment() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        khphongban: '',
        tenphongban: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_Department', formData)
            .then(res => {
                console.log('Response:', res.data); // Log successful response
                alert('Thêm phòng ban thành công'); // Display success alert
                navigate('/CRUD_Department');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Thêm phòng ban thành công');// Log error for debugging
            });
    };

    return (

        <div className={styles.departmentCreateContainer}> {/* Use the same container class */}
            <h2>Tạo phòng ban</h2>
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Kí hiệu phòng ban:</label>
                        <input
                            type="text"
                            name="khphongban"
                            value={formData.khphongban}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Tên phòng ban:</label>
                        <input
                            type="text"
                            name="tenphongban"
                            value={formData.tenphongban}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Tạo</button>
                </div>
            </form>
        </div>

    );
}

export default CreateDepartment;

