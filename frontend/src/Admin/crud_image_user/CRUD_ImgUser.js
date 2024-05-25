import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import './CRUD_ImgUser.css';

function CRUD_ImgUser() {
    const [userImages, setUserImages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleViewUser = (user) => {
        setSelectedUser(user);
    };

    console.log(selectedUser);

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className="crud-user-container w-90">
                        <div className="d-flex justify-content-end mb-2">
                            <Link to="/create_ImgUser" className="btn btn-success">Add +</Link>
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
                                            {image.Image && <img src={`http://localhost:8081${image.Image}`} alt={image.UserName} style={{ width: '50px', height: '50px' }} />}
                                        </td>
                                        <td>{image.ID_User}</td>
                                        <td>
                                            <Link to={`/update_ImgUser/${image.ID}`} className="btn btn-primary">Sửa</Link>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(image.ID)}>Xóa</button>
                                            <button className="btn btn-info ms-2" onClick={() => handleViewUser(image)}>Xem</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedUser && (
                        <div className="user-info-modal">
                            <div className="user-info-content">
                                <h3>Thông tin người dùng</h3>
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                            <th>ID</th>
                                            <td>{selectedUser.ID}</td>
                                        </tr>
                                        <tr>
                                            <th>Họ và Tên</th>
                                            <td>{selectedUser.UserName}</td>
                                        </tr>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <td>
                                                {selectedUser.Image && <img src={`http://localhost:8081/Images/${selectedUser.Image}`} alt={selectedUser.UserName} style={{ width: '200px', height: '200px' }} />}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>ID_User</th>
                                            <td>{selectedUser.ID_User}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button onClick={() => setSelectedUser(null)} className="btn btn-primary">Đóng</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default CRUD_ImgUser;
