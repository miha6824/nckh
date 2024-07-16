import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './UserCreate.module.css';

function UserCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        sex: '',
        dob: '',
        phoneNumber: '',
        address: '',
        id_departments: '',
        hsl: '',
        // position: ''
    });
    const [departments, setDepartments] = useState([]);
    const [salaryScales, setSalaryScales] = useState([]);
    // const [positions, setPositions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/HSLuong')
            .then(res => setSalaryScales(res.data))
            .catch(err => console.log(err));
        // axios.get('http://localhost:8081/positions')
        //     .then(res => setPositions(res.data))
        //     .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handlePhoneNumberInput = (e) => {
        // Chỉ cho phép các ký tự số
        const newValue = e.target.value.replace(/\D/g, '');
        setFormData({ ...formData, phoneNumber: newValue });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra ngày sinh
        const currentDate = new Date();
        const dobDate = new Date(formData.dob);
        if (dobDate > currentDate) {
            alert('Ngày sinh không được lớn hơn ngày hiện tại');
            return; // Không thực hiện gửi dữ liệu
        }
        axios.post('http://localhost:8081/create_user', formData)
            .then(res => {
                console.log('Response:', res.data); // Log successful response
                alert('Thêm người dùng thành công'); // Display success alert
                navigate('/CRUD_User');
            })
            .catch(err => {
                console.error('Error:', err);
                if (err.response && err.response.status === 400) {
                    alert('Người dùng đã tồn tại');
                } else {
                    alert('Thêm người không thành công');
                }// Log error for debugging
            });
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div className={styles.userCreateContainer}>
            <div className={styles.backButton} onClick={handleGoBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <h2>Thêm nhân viên</h2>
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
                            <option>Chọn giới tính</option>
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
                            type="number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handlePhoneNumberInput}
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
                            <option>Chọn phòng ban</option>
                            {departments.map(dept => (
                                <option key={dept.ID} value={dept.ID}>
                                    {dept.TenPhongBan}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="form-group">
                        <label>Chức vụ:</label>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option>Chọn chức vụ</option>
                            {positions.map(pos => (
                                <option key={pos.ID} value={pos.ID}>
                                    {pos.TenCV}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    <div className="form-group">
                        <label>Hệ số lương:</label>
                        <select
                            name="hsl"
                            value={formData.hsl}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option>Chọn hệ số lương</option>
                            {salaryScales.map(salary => (
                                <option key={salary.HSLuong} value={salary.HSLuong}>
                                    {salary.HSLuong}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Tạo</button>
            </form>
        </div>
    );
}

export default UserCreate;
