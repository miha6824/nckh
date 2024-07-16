import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreateDepartment.module.css';

function CreateDepartment({ onClose, onCreateSuccess }) {
    const [formData, setFormData] = useState({
        tenphongban: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_Department', formData)
            .then(res => {
                console.log('Response:', res.data);
                alert('Thêm phòng ban thành công');
                onCreateSuccess();
                onClose();
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Thêm phòng ban thành công');
            });
    };

    return (
        <div className={styles.departmentCreateContainer}>
            <h2>Tạo phòng ban</h2>
            <form onSubmit={handleSubmit} className="row">
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
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Tạo</button>
                </div>
            </form>
        </div>
    );
}

export default CreateDepartment;
