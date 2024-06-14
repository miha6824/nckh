import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import '@coreui/coreui/dist/css/coreui.min.css';

function CRUD_Attendance() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Attendance')
            .then(res => {
                setUser(res.data);
                console.log(res.data); // Kiểm tra dữ liệu trả về từ server
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_atten/${id}`);
            window.location.reload();
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
                            <Link to="/create_User" className="btn btn-success">Add +</Link>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>ID_User</th>
                                    <th>Date Time</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((data, i) => (
                                    <tr key={i}>
                                        <td>{data.ID}</td>
                                        <td>{data.ID_User}</td>
                                        <td>{moment(data.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                                        <td>
                                            <img src={data.Image} alt={`attendance_${data.ID}`} style={{ width: '200px' }} />
                                        </td>
                                        <td>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(data.ID)}>Xóa</button>
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

export default CRUD_Attendance;
