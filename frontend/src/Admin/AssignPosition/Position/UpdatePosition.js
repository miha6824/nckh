import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UpdatePositions.module.css';

function PositionUpdate({ id, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({
        tencv: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:8081/PositionName/${id}`)
            .then(res => {
                const prePositionInfo = res.data;
                console.log(prePositionInfo);
                setFormData({
                    tencv: prePositionInfo.TenCV,
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/UpdatePositions/${id}`, formData)
            .then(res => {
                alert('Cập nhật thành công');
                onUpdateSuccess();
            })
            .catch(err => console.log(err));
    };

    return (
        <div className={styles.updatePositionContainer}>
            <h2>Sửa chức vụ</h2>
            <form onSubmit={handleSubmit} className="row">
                <div className="form-group">
                    <label>Tên chức vụ:</label>
                    <input
                        name="tencv"
                        type="text"
                        value={formData.tencv}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Sửa</button>
                </div>
            </form>
        </div>
    );
}

export default PositionUpdate;
