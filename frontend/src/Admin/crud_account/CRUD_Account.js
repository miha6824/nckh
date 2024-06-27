import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './CRUD_Account.module.css'; // Tạo file CSS mới hoặc sử dụng CSS hiện tại

function CRUD_Account() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const accountsPerPage = 10;

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Account')
            .then(res => {
                const formattedAccounts = res.data.map(item => ({
                    ...item,
                    // Format ngày sinh nếu cần thiết
                }));
                setAccounts(formattedAccounts);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/Delete_account/' + id);
            setAccounts(accounts.filter(data => data.ID !== id));
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

    const offset = currentPage * accountsPerPage;
    const filteredAccounts = accounts.filter(acc =>
        acc.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.Role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredAccounts.slice(offset, offset + accountsPerPage);
    const pageCount = Math.ceil(filteredAccounts.length / accountsPerPage);

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.crudAccountContainer}>
                        <div className="d-flex justify-content-between mb-2 align-items-center">
                            <h2>Quản lý tài khoản</h2>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <Link to="/create_Account" className={styles.addButton}>
                                    <FaPlus />
                                </Link>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className="table">
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th>ID</th>
                                        <th>Email</th>
                                        <th>Password</th>
                                        <th>ID_User</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((acc, i) => (
                                        <tr key={i}>
                                            <td>{acc.ID}</td>
                                            <td>{acc.Email}</td>
                                            <td>{acc.Password}</td>
                                            <td>{acc.ID_User}</td>
                                            <td>{acc.Role}</td>
                                            <td>
                                                <Link to={`/update_Account/${acc.ID}`} className="btn btn-primary">
                                                    <FaEdit />
                                                </Link>
                                                <button className="btn btn-danger ms-2" onClick={() => handleDelete(acc.ID)}>
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

export default CRUD_Account;
