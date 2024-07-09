import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './UserUpdate.module.css';

function UserUpdate() {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        sex: '',
        dob: '',
        phoneNumber: '',
        address: '',
        id_departments: '',
        hsl: '',
        id_positions: '' // New state for selected position
    });

    const [departments, setDepartments] = useState([]);
    const [salaryScales, setSalaryScales] = useState([]);
    const [positions, setPositions] = useState([]); // State for positions
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8081/user/${id}`)
            .then(res => {
                const PreUserInfo = res.data;
                setFormData({
                    email: PreUserInfo.Email,
                    fullName: PreUserInfo.FullName,
                    dob: new Date(PreUserInfo.BirthDay).toISOString().split('T')[0],
                    phoneNumber: PreUserInfo.Telephone,
                    address: PreUserInfo.Address,
                    sex: PreUserInfo.Sex,
                    id_departments: PreUserInfo.ID_Department,
                    hsl: PreUserInfo.HSLuong,
                    id_positions: PreUserInfo.MaCV // Assuming MaCV is the position ID from position_details
                });
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/HSLuong')
            .then(res => setSalaryScales(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_Position')
            .then(res => setPositions(res.data))
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8081/update_user/${id}`, formData)
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
                    <div className={styles.userUpdateContainer}>
                        <h2>Update User</h2>
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
                                    <label>Gender:</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Birth Date:</label>
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
                                    <label>Department:</label>
                                    <select
                                        name="id_departments"
                                        value={formData.id_departments}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        {departments.map(dept => (
                                            <option key={dept.ID} value={dept.ID}>
                                                {dept.TenPhongBan}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Position:</label>
                                    <select
                                        name="id_positions"
                                        value={formData.id_positions}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        {positions.map(pos => (
                                            <option key={pos.ID} value={pos.ID}>
                                                {pos.TenCV}
                                            </option>
                                        ))}
                                    </select>
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

export default UserUpdate;
