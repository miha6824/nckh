import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CRUD_Department.module.css';

function CRUD_Department() {
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const departmentsPerPage = 10; // Number of departments per page

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_department/${id}`);
            setDepartments(departments.filter(data => data.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    // Pagination logic
    const offset = currentPage * departmentsPerPage;
    const filteredDepartments = departments.filter(data =>
        data.TenPhongBan.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredDepartments.slice(offset, offset + departmentsPerPage);
    const pageCount = Math.ceil(filteredDepartments.length / departmentsPerPage);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
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
                    <Link to="/create_department" className={styles.addButton}>
                        <FaPlus />
                    </Link>
                </div>
            </div>
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>ID</th>
                            <th>Kí hiệu</th>
                            <th>Tên Phòng Ban</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map((data, index) => (
                            <tr key={data.ID}>
                                <td>{data.ID}</td>
                                <td>{data.KHPhongBan}</td>
                                <td>{data.TenPhongBan}</td>
                                <td className={styles.actions}>
                                    <Link to={`/update_department/${data.ID}`} className={`${styles.actionButton} ${styles.editButton}`}>
                                        <FaEdit /> Sửa
                                    </Link>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(data.ID)}>
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

export default CRUD_Department;
