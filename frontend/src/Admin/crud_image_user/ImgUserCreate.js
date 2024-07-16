import React, { useState } from 'react';
import axios from 'axios';

function ImgUserCreate() {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('image', formData.image);
        data.append('id_user', formData.id_user);

        axios.post('http://localhost:8081/create_ImgUser', data)
            .then(res => console.log(res.data))
            .catch(err => {
                console.error("Error uploading image:", err);
                console.error("Response data:", err.response.data);
            });
    };

    return (

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
                        <input type="file" id="image" name="image" onChange={handleChange} className="form-control" accept=".png" required />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="id_user" className="form-label">ID_User</label>
                        <input type="text" id="id_user" name="id_user" value={formData.id_user} onChange={handleChange} className="form-control" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </form>
            </div>
        </div>

    );
}

export default ImgUserCreate;
