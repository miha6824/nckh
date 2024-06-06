import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import './CRUD_ImgUser.css';

function CRUD_ImgUser() {
    const [userImages, setUserImages] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_ImgUser')
            .then(res => {
                setUserImages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_ImgUser/${id}`);
            setUserImages(userImages.filter(image => image.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className="crud-user-container w-90">
                        <div className="d-flex justify-content-end mb-2">
                            <Link to="/create_ImgUser" className="btn btn-success">Tạo ảnh cho nhân viên mới+</Link>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ và Tên</th>
                                    <th>Hình ảnh</th>
                                    <th>ID_User</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userImages.map(image => (
                                    <tr key={image.ID}>
                                        <td>{image.ID}</td>
                                        <td>{image.UserName}</td>
                                        <td>
                                            {image.Image && <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} style={{ width: '120px', height: '120px' }} />}
                                        </td>
                                        <td>{image.ID_User}</td>
                                        <td>
                                            <Link to={`/ImgUserAdd/${image.ID}`} className="btn btn-primary">Thêm ảnh</Link>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(image.ID)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CRUD_ImgUser;
