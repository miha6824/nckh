import React, { useState } from 'react';
import axios from 'axios';
import styles from './CreatePosition.module.css';

function CreatePosition({ onClose, onCreateSuccess }) {
    const [formData, setFormData] = useState({
        tencv: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/CreatePosition', formData)
            .then(res => {
                console.log('Response:', res.data);
                alert('Thêm chức vụ thành công');
                onCreateSuccess();
                onClose();
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Thêm chức vụ thành công');
            });
    };

    return (
        <div className={styles.positionCreateContainer}>
            <h2>Tạo chức vụ</h2>
            <form onSubmit={handleSubmit} className="row">
                <div className="form-group">
                    <label>Tên chức vụ:</label>
                    <input
                        type="text"
                        name="tencv"
                        value={formData.tencv}
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

export default CreatePosition;
