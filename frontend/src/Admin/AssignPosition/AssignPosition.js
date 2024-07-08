import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './AssignPosition.module.css';

function AssignPosition() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        MaCTChucvu: '',
        MaCV: '',
        ID_User: '',
        NgayBatDau: '',
        NgayKetThuc: '',
        LyDo: ''
    });
    const [positions, setPositions] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/positions')
            .then(res => setPositions(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_User')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/assign_position', formData)
            .then(res => {
                console.log('Response:', res.data);
                alert('Gán chức vụ thành công');
                navigate('/CRUD_User');
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Gán chức vụ không thành công');
            });
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.assignPositionContainer}>
                        <h2>Assign Position</h2>
                        <form onSubmit={handleSubmit} className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Position:</label>
                                    <select
                                        name="MaCV"
                                        value={formData.MaCV}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option>Chọn chức vụ</option>
                                        {positions.map(position => (
                                            <option key={position.ID} value={position.ID}>
                                                {position.TenCV}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Employee:</label>
                                    <select
                                        name="ID_User"
                                        value={formData.ID_User}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option>Chọn nhân viên</option>
                                        {users.map(user => (
                                            <option key={user.ID} value={user.ID}>
                                                {user.FullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Start Date:</label>
                                    <input
                                        type="date"
                                        name="NgayBatDau"
                                        value={formData.NgayBatDau}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date:</label>
                                    <input
                                        type="date"
                                        name="NgayKetThuc"
                                        value={formData.NgayKetThuc}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                            </div>
                            <div className="form-group">
                                <label>Reason:</label>
                                <textarea
                                    name="LyDo"
                                    value={formData.LyDo}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                ></textarea>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignPosition;
