import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './CRUD_Department.module.css'; // Ensure the correct CSS file path

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
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.crudDepartmentContainer}>
                        <div className="d-flex justify-content-between mb-2 align-items-center">
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
                                    <FaPlus className={styles.icon} />
                                </Link>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Kí hiệu</th>
                                    <th>Tên Phòng Ban</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.ID}</td>
                                        <td>{data.KHPhongBan}</td>
                                        <td>{data.TenPhongBan}</td>
                                        <td>
                                            <Link to={`/update_department/${data.ID}`} className="btn btn-primary"><FaEdit /></Link>
                                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(data.ID)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

export default CRUD_Department;
