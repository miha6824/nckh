import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import './CRUD_ImgUser.css';

function CRUD_ImgUser() {
    const [userimage, setUserImg] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_ImgUser')
            .then(res => {
                const formattedUser = res.data.map(item => ({
                    ...item
                }));
                setUserImg(formattedUser);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/Delete_ImgUser/' + id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
    };

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
                                {userimage.map((data, i) => (
                                    <tr key={i}>
                                        <td>{data.ID}</td>
                                        <td>{data.UserName}</td>
                                        <td>{data.Image}</td>
                                        <td>{data.ID_User}</td>
                                        <td>
                                            <Link to={`/update_ImgUser/${data.ID}`} className="btn btn-primary">Sửa</Link>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(data.ID)}>Xóa</button>
                                            <button className="btn btn-info ms-2" onClick={() => handleViewUser(data)}>Xem</button>
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
                                            <td>{selectedUser.Image}</td>
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
    )
}

export default CRUD_ImgUser;
