// CRUD_User.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CRUD_User.module.css';

function CRUD_User() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const usersPerPage = 7;

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_User')
            .then(res => {
                const formattedUsers = res.data.map(item => ({
                    ...item,
                    BirthDay: new Date(item.BirthDay).toLocaleDateString('en-GB')
                }));
                setUsers(formattedUsers);
            })
            .catch(err => console.log(err));

        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_user/${id}`);
            setUsers(users.filter(user => user.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    const offset = currentPage * usersPerPage;
    const filteredUsers = users.filter(user =>
        user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredUsers.slice(offset, offset + usersPerPage);
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

    const getDepartmentName = (departmentId) => {
        const department = departments.find(dept => dept.ID === departmentId);
        return department ? department.TenPhongBan : '';
    };

    return (
        <div className={`${styles.crudUserContainer} container-fluid`}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Quản lý nhân viên</h2>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Link to="/create_User" className={styles.addButton}>
                        <FaPlus />
                    </Link>
                </div>
            </div>
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Email</th>
                            <th>Họ và Tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Tên Phòng Ban</th>
                            <th>Hệ số lương</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map(user => (
                            <tr key={user.ID}>
                                <td>{user.Email}</td>
                                <td>{user.FullName}</td>
                                <td>{user.Sex}</td>
                                <td>{user.BirthDay}</td>
                                <td>{user.Telephone}</td>
                                <td>{user.Address}</td>
                                <td>{getDepartmentName(user.ID_Department)}</td>
                                <td>{user.HSLuong}</td>
                                <td className={styles.actions}>
                                    <Link to={`/update_user/${user.ID}`} className={`${styles.actionButton} ${styles.editButton}`}>
                                        <FaEdit /> Sửa
                                    </Link>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(user.ID)}>
                                        <FaTrash /> Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                previousLabel={<FaArrowLeft />}
                nextLabel={<FaArrowRight />}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={styles.pagination}
                activeClassName={'active'}
                previousClassName={styles.pageItem}
                nextClassName={styles.pageItem}
                previousLinkClassName={styles.pageLink}
                nextLinkClassName={styles.pageLink}
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
            />
        </div>
    );
}

export default CRUD_User;
