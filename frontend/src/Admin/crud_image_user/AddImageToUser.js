import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';

function AddImageToUser() {
    const [formData, setFormData] = useState({
        username: '',
        image: '',
        id_user: ''
    });

    const { id } = useParams();

    useEffect(() => {
        // Lấy thông tin về UserName và ID_User từ server khi component được tải
        axios.get(`http://localhost:8081/userInfo4AddImg/${id}`)
            .then(res => {
                const userInfo = res.data;
                setFormData({
                    username: userInfo.UserName,
                    id_user: userInfo.ID_User
                });
            })
            .catch(err => {
                console.error("Error fetching user info:", err);
            });
    }, [id]);

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

        axios.post(`http://localhost:8081/ImgUserAdd/${id}`, data)
            .then(res => console.log(res.data))
            .catch(err => {
                console.error("Error uploading image:", err);
                console.error("Response data:", err.response.data);
            });
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
                </div>
            </div>
        </div>
    );
}

export default AddImageToUser;
