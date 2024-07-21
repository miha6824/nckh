import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CRUD_Account.module.css';

function CRUD_Account() {
    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const accountsPerPage = 7;

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Account')
            .then(res => {
                const formattedAccounts = res.data.map(item => ({
                    ...item,
                }));
                setAccounts(formattedAccounts);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_account/${id}`);
            setAccounts(accounts.filter(acc => acc.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const offset = currentPage * accountsPerPage;
    const filteredAccounts = accounts.filter(acc =>
        acc.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.Role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredAccounts.slice(offset, offset + accountsPerPage);
    const pageCount = Math.ceil(filteredAccounts.length / accountsPerPage);

    return (
        <div className={styles.crudAccountContainer}>
            <div className={`d-flex justify-content-between mb-3 align-items-center`}>
                <h2>Quản lý tài khoản</h2>
                <div className={`d-flex align-items-center`}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {/* <Link to="/create_Account" className={styles.addButton}>
                        <FaPlus />
                    </Link> */}
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={`table table-bordered`}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>ID_User</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map(acc => (
                            <tr key={acc.ID}>
                                <td>{acc.Email}</td>
                                <td>{acc.Password}</td>
                                <td>{acc.ID_User}</td>
                                <td>{acc.Role}</td>
                                <td className={styles.actions}>
                                    <Link to={`/update_Account/${acc.ID}`} className={`${styles.actionButton} ${styles.editButton}`}>
                                        <FaEdit />
                                        <span>Sửa</span>
                                    </Link>
                                    {/* <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(acc.ID)}>
                                                <FaTrash /> Xoá
                                    </button> */}
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
                activeLinkClassName={styles.activeLink}
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

export default CRUD_Account;
