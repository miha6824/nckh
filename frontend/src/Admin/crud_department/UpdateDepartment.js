import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './UpdateDepartment.module.css';

function DepartmentUpdate({ id, onClose, onUpdateSuccess }) {
    const [formData, setFormData] = useState({
        TenPhongBan: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:8081/DepartmentName/${id}`)
            .then(res => {
                const PreDepartmentInfo = res.data;
                setFormData({
                    TenPhongBan: PreDepartmentInfo,
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/update_Department/${id}`, formData)
            .then(res => {
                alert('Update successful');
                onUpdateSuccess();
            })
            .catch(err => console.log(err));
    };

    return (
        <div className={styles.updateDepartmentContainer}>
            <h2>Sửa phòng ban</h2>
            <form onSubmit={handleSubmit} className="row">
                <div className="form-group">
                    <label>Tên phòng ban:</label>
                    <input
                        name="TenPhongBan"
                        type="text"
                        value={formData.TenPhongBan}
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

DepartmentUpdate.propTypes = {
    id: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
};

export default DepartmentUpdate;
