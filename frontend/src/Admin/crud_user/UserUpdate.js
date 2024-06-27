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
        hsl: ''
    });

    const [departments, setDepartments] = useState([]);
    const [salaryScales, setSalaryScales] = useState([]);
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
                    hsl: PreUserInfo.HSLuong
                });
            })
            .catch(err => console.log(err));
    }, [id]);

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
        axios.put(`http://localhost:8081/update_user/${id}`, formData)
            .then(res => {
                console.log(res.data);
                alert('Thay đổi thành công');
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
                        <h2>Cập nhật người dùng</h2>
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
                                    <label>Họ và Tên:</label>
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
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Ngày sinh:</label>
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
                                    <label>Số điện thoại:</label>
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
                                    <label>Địa chỉ:</label>
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
                                <button type="submit" className="btn btn-primary">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserUpdate;
