import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

function CRUD_User() {

    const [user, setUser] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_User')
            .then(res => {
                const formattedUser = res.data.map(item => ({
                    ...item,
                    BirthDay: new Date(item.BirthDay).toLocaleDateString('en-GB')
                }));
                setUser(formattedUser);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded'>
                <Link to="/create_User" className='btn btn-success'>Add +</Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Họ và Tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Hệ số lương</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.ID}</td>
                                    <td>{data.Email}</td>
                                    <td>{data.FullName}</td>
                                    <td>{data.Sex}</td>
                                    <td>{data.BirthDay}</td>
                                    <td>{data.Telephone}</td>
                                    <td>{data.Address}</td>
                                    <td>{data.HSLuong}</td>
                                    <td>
                                        <button className='btn btn-primary'>Sửa</button>
                                        <button className='btn btn-danger ms-2'>Xóa</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CRUD_User
