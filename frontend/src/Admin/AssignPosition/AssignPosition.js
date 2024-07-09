import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './AssignPosition.module.css';

function AssignPosition() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        MaCV: '',
        ID_User: '',
        ID_Department: '', // Thêm ID_Department vào formData
        LyDo: ''
    });
    const [positions, setPositions] = useState([]);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]); // State để lưu trữ danh sách phòng ban
    const [selectedUserName, setSelectedUserName] = useState(''); // State để lưu trữ tên nhân viên được chọn

    useEffect(() => {
        axios.get('http://localhost:8081/positions')
            .then(res => setPositions(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_User')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_Department') // Gọi endpoint để lấy danh sách phòng ban
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        // Nếu ID_User thay đổi, cập nhật ID_Department và tên nhân viên
        const selectedUser = users.find(user => user.ID === parseInt(formData.ID_User));
        if (selectedUser) {
            setFormData({
                ...formData,
                ID_Department: selectedUser.ID_Department
            });
            setSelectedUserName(selectedUser.FullName);
        }
    }, [formData.ID_User, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
