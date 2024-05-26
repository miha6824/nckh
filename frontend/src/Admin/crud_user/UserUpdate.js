import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

    const { id } = useParams();

    const [values, setValues] = useState({
        id: id,
        email: '',
        fullName: '',
        sex: '',
        dob: '',
        phoneNumber: '',
        address: '',
        id_departments: '',
        hsl: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        axios.get('http://localhost:8081/user/' + id)
            .then(res => {
                setValues({ ...values, email: res.data.Email, fullName: res.data.FullName, sex: res.data.Sex, dob: res.data.Birthday, phoneNumber: res.data.Telephone, address: res.data.Address, id_departments: res.data.Id_Department, hsl: res.data.HSLuong })
            })
    })


    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:8081/update_user/' + id, formData)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

    };


    return (
        <div className="container">
            <h2>Update User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={values.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={values.fullName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Sex:</label>
                    <input type="text" name="sex" value={values.sex} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input type="date" name="dob" value={values.dob} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" value={values.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>ID_Departments:</label>
                    <input type="text" name="id_departments" value={values.id_departments} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Hệ Số Lương:</label>
                    <input type="text" name="hsl" value={values.hsl} onChange={handleChange} required />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UserUpdate;
