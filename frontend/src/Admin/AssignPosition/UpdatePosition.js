import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './PositionUpdate.module.css';

function PositionUpdate() {
    const [formData, setFormData] = useState({
        MaCV: '',
        ID_User: '',
        ID_Department: '', // Thêm ID_Department vào formData
        LyDo: ''
    });

    const [departments, setDepartments] = useState([]);
    const [users, setUser] = useState([]);
    const [positions, setPositions] = useState([]); // State for positions
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/position_details/${id}`)
            .then(res => {
                const PrePositionInfo = res.data;
                setFormData({
                    MaCV: PrePositionInfo.MaCV,
                    ID_User: PrePositionInfo.ID_User,
                    ID_Department: PrePositionInfo.ID_Department,
                });
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_User')
            .then(res => setUser(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/positions')
            .then(res => setPositions(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/update_position/${id}`, formData)
            .then(res => {
                console.log(res.data);
                alert('Update successful');
                navigate('/CRUD_User');
            })
            .catch(err => console.log(err));
    };


    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.updatePositionContainer}>
                        <h2>Update User</h2>
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
                            </div>
                            <div className="col-md-6">
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
                                <div className="form-group">
                                    <label>Department:</label>
                                    <select
                                        name="ID_Department"
                                        value={formData.ID_Department}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled
                                    >
                                        <option>Chọn phòng ban</option>
                                        {departments.map(department => (
                                            <option key={department.ID} value={department.ID}>
                                                {department.TenPhongBan}
                                            </option>
                                        ))}
                                    </select>
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
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PositionUpdate;
