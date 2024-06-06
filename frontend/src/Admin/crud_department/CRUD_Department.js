import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar'
import AdNavbar from '../AdNav/AdNavbar';
import '@coreui/coreui/dist/css/coreui.min.css';

function CRUD_Department() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => {
                const formattedUser = res.data.map(item => ({
                    ...item,
                    BirthDay: new Date(item.BirthDay).toLocaleDateString('en-GB')
                }));
                setUser(formattedUser);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/Delete_user/' + id);
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
                    <div className="crud-user-container w-90    ">
                        <div className="d-flex justify-content-end mb-2">
                            <Link to="/create_User" className="btn btn-success">Add +</Link>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>kí hiệu</th>
                                    <th>Tên Phòng Ban</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((data, i) => (
                                    <tr key={i}>
                                        <td>{data.ID}</td>
                                        <td>{data.KHPhongBan}</td>
                                        <td>{data.TenPhongBan}</td>
                                        <td>
                                            <Link to={`/update_user/${data.ID}`} className="btn btn-primary">Sửa</Link>
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

export default CRUD_Department;
