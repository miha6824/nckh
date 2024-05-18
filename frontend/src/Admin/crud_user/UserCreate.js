import React, { useState } from 'react';
import axios from 'axios';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
function UserCreate() {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_user', formData)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    };


    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container">
                    <h2>Create User</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Sex:</label>
                            <input type="text" name="sex" value={formData.sex} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>ID_Departments:</label>
                            <input type="text" name="id_departments" value={formData.id_departments} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Hệ Số Lương:</label>
                            <input type="text" name="hsl" value={formData.hsl} onChange={handleChange} required />
                        </div>
                        <button type="submit">Create</button>
                    </form>
                </div></div></div>




    );
}

export default UserCreate;
