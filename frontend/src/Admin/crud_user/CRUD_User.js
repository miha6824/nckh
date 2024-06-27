import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './CRUD_User.module.css';

function CRUD_User() {
    const [user, setUser] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const usersPerPage = 10;

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
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/Delete_user/' + id);
            setUser(user.filter(u => u.ID !== id));
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
    const filteredUsers = user.filter(u =>
        u.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredUsers.slice(offset, offset + usersPerPage);
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.crudUserContainer}>
                        <div className="d-flex justify-content-between mb-2 align-items-center">
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
                        <div className={styles.tableContainer}>
                            <table className="table">
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th>Email</th>
                                        <th>Họ và Tên</th>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th>Số điện thoại</th>
                                        <th>Địa chỉ</th>
                                        <th>ID_Department</th>
                                        <th>Hệ số lương</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((data, i) => (
                                        <tr key={i}>
                                            <td>{data.Email}</td>
                                            <td>{data.FullName}</td>
                                            <td>{data.Sex}</td>
                                            <td>{data.BirthDay}</td>
                                            <td>{data.Telephone}</td>
                                            <td>{data.Address}</td>
                                            <td>{data.ID_Department}</td>
                                            <td>{data.HSLuong}</td>
                                            <td>
                                                <Link to={`/update_user/${data.ID}`} className="btn btn-primary">
                                                    <FaEdit />
                                                </Link>
                                                <button className="btn btn-danger ms-2" onClick={() => handleDelete(data.ID)}>
                                                    <FaTrash />
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
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            previousClassName={styles.pageItem}
                            nextClassName={styles.pageItem}
                            previousLinkClassName={styles.pageLink}
                            nextLinkClassName={styles.pageLink}
                            pageClassName={styles.pageItem}
                            pageLinkClassName={styles.pageLink}
                            activeLinkClassName={styles.pageItemActive}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CRUD_User;
