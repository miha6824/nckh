import React, { useState } from 'react';
import axios from 'axios';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';

function ImgUserCreate() {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/create_ImgUser', formData)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
                    <div className="card w-50">
                        <div className="card-header">
                            <h2 className="card-title">Create User</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="username" className="form-label">Họ và tên</label>
                                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="image" className="form-label">Hình ảnh</label>
                                    <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className="form-control" required />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="id_user" className="form-label">ID_User</label>
                                    <input type="text" id="id_user" name="id_user" value={formData.id_user} onChange={handleChange} className="form-control" required />
                                </div>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImgUserCreate;
