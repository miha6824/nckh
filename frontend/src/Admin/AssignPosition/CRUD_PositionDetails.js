import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CRUD_PositionDetails.module.css';

const PositionDetails = () => {
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const positionsPerPage = 7;

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_positions')
            .then(res => {
                setPositions(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the positions!', error);
            });

        axios.get('http://localhost:8081/CRUD_Department')
            .then(res => {
                setDepartments(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the departments!', error);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_position_detail/${id}`);
            setPositions(positions.filter(data => data.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
        sessionStorage.setItem('currentPage', event.selected);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const offset = currentPage * positionsPerPage;

    const filteredPositions = positions.filter(position =>
        (selectedDepartment === '' || position.TenPhongBan === selectedDepartment) &&
        (position.TenCV.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.TenPhongBan.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentPageData = filteredPositions.slice(offset, offset + positionsPerPage);
    const pageCount = Math.ceil(filteredPositions.length / positionsPerPage);

    return (
        <div className={styles.crudPositionContainer}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Quản lý chức vụ</h2>
                <div className="d-flex align-items-center">
                    <select value={selectedDepartment} onChange={handleDepartmentChange} className={styles.departmentSelect}>
                        <option value="">Tất cả phòng ban</option>
                        {departments.map(dep => (
                            <option key={dep.ID} value={dep.TenPhongBan}>{dep.TenPhongBan}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Link to="/CreatePosition" className={styles.addButton}>
                        <FaPlus />
                    </Link>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={`table table-bordered ${styles.positionTable}`}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Chức vụ</th>
                            <th>Người sở hữu</th>
                            <th>Phòng ban</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map((data) => (
                            <tr key={data.ID}>
                                <td>{data.TenCV}</td>
                                <td>{data.FullName}</td>
                                <td>{data.TenPhongBan}</td>
                                <td className={styles.actions}>
                                    <Link to={`/PositionUpdate/${data.ID}`} className={`${styles.actionButton} ${styles.editButton}`}>
                                        <FaEdit />
                                        <span className="d-none d-md-inline">Sửa</span>
                                    </Link>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(data.ID)}>
                                        <FaTrash />
                                        <span className="d-none d-md-inline">Xoá</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.controlsContainer}>
                <Link to={'/Crud_Position'} className={`${styles.actionButton1} ${styles.naviButton}`}>
                    Các chức vụ
                </Link>
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
        </div>
    );
};

export default PositionDetails;
