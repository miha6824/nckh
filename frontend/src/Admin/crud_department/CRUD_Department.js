import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from './CRUD_Department.module.css';
import CreateDepartment from './CreateDepartment';
import DepartmentUpdate from './UpdateDepartment';

function CRUD_Department() {
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDepartmentId, setCurrentDepartmentId] = useState(null);

    const departmentsPerPage = 10;

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8081/Delete_department/${id}`);
            if (res.status === 200) {
                fetchDepartments();
                setError('');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                console.log(err);
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const offset = currentPage * departmentsPerPage;
    const filteredDepartments = departments.filter(data =>
        data.TenPhongBan.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredDepartments.slice(offset, offset + departmentsPerPage);
    const pageCount = Math.ceil(filteredDepartments.length / departmentsPerPage);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    const handleCreateSuccess = () => {
        fetchDepartments();
        setShowCreateForm(false);
    };

    const handleUpdateClick = (id) => {
        setCurrentDepartmentId(id);
        setShowUpdateForm(true);
    };

    const handleCloseUpdateForm = () => {
        setShowUpdateForm(false);
        setCurrentDepartmentId(null);
    };

    const handleUpdateSuccess = () => {
        fetchDepartments();
        setShowUpdateForm(false);
        setCurrentDepartmentId(null);
    };

    return (
        <div className={`${styles.crudDepartmentContainer} container-fluid`}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Quản lý phòng ban</h2>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className={styles.addButton} onClick={toggleCreateForm}>
                        <FaPlus />
                    </button>
                </div>
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>ID</th>
                            <th>Tên Phòng Ban</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map((data, index) => (
                            <tr key={data.ID}>
                                <td>PB{data.ID}</td>
                                <td>{data.TenPhongBan}</td>
                                <td className={styles.actions}>
                                    <button
                                        onClick={() => handleUpdateClick(data.ID)}
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                    >
                                        <FaEdit /> Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(data.ID)}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                    >
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
                activeLinkClassName={styles.activeLink}
                previousClassName={styles.pageItem}
                nextClassName={styles.pageItem}
                previousLinkClassName={styles.pageLink}
                nextLinkClassName={styles.pageLink}
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
            />
            {showCreateForm && (
                <div className={`${styles.createFormOverlay}`}>
                    <div className={`${styles.createForm}`}>
                        <button className={styles.closeButton} onClick={handleCloseCreateForm}>
                            <FaTimes />
                        </button>
                        <CreateDepartment onClose={handleCloseCreateForm} onCreateSuccess={handleCreateSuccess} />
                    </div>
                </div>
            )}
            {showUpdateForm && (
                <div className={`${styles.createFormOverlay}`}>
                    <div className={`${styles.createForm}`}>
                        <button className={styles.closeButton} onClick={handleCloseUpdateForm}>
                            <FaTimes />
                        </button>
                        <DepartmentUpdate id={currentDepartmentId} onClose={handleCloseUpdateForm} onUpdateSuccess={handleUpdateSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CRUD_Department;
