import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './CRUD_Positions.module.css';

const PositionList = () => {
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]); // State để lưu danh sách phòng ban
    const [selectedDepartment, setSelectedDepartment] = useState(''); // State để lưu phòng ban được chọn
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
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
        setCurrentPage(0);
    };

    const offset = currentPage * positionsPerPage;

    // Áp dụng bộ lọc theo phòng ban được chọn và từ khóa tìm kiếm
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
                    <Link to="/AssignPosition" className={styles.addButton}>
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
                        {currentPageData.map((data, index) => (
                            <tr key={data.ID}>
                                <td>{data.TenCV}</td>
                                <td>{data.FullName}</td>
                                <td>{data.TenPhongBan}</td>
                                <td className={styles.actions}>
                                    <Link to={`/PositionUpdate/${data.ID}`} className={`${styles.actionButton} ${styles.editButton}`}>
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
};

export default PositionList;
