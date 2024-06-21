import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CRUD_Attendance.module.css';
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

function CRUD_Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const attendancesPerPage = 5; // Hiển thị 5 chấm công trên mỗi trang

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Attendance')
            .then(res => {
                setAttendanceData(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_atten/${id}`);
            setAttendanceData(attendanceData.filter(data => data.ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    const offset = currentPage * attendancesPerPage;
    const filteredAttendances = attendanceData.filter(data =>
        data.ID_User.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredAttendances.slice(offset, offset + attendancesPerPage);
    const pageCount = Math.ceil(filteredAttendances.length / attendancesPerPage);

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.crudAttendanceContainer}>
                        <div className="d-flex justify-content-between mb-2 align-items-center">
                            <h2>Quản lý chấm công</h2>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <Link to="/create_Attendance" className={styles.addButton}>
                                    Thêm +
                                </Link>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={`table ${styles.table}`}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ID Người dùng</th>
                                        <th>Thời gian</th>
                                        <th>Ảnh</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map(data => (
                                        <tr key={data.ID}>
                                            <td>{data.ID}</td>
                                            <td>{data.ID_User}</td>
                                            <td>{moment(data.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>
                                                <img src={data.Image} alt={`attendance_${data.ID}`} className={styles.image} />
                                            </td>
                                            <td className={styles.actions}>
                                                <button className={`btn btn-danger ${styles['btn-danger']}`} onClick={() => handleDelete(data.ID)}>
                                                    <FaTrash className={styles.icon} />
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
                            onPageChange={handlePageClick}
                            containerClassName={styles.pagination}
                            previousLinkClassName={styles['page-link']}
                            nextLinkClassName={styles['page-link']}
                            disabledClassName={styles['page-disabled']}
                            activeClassName={styles['page-active']}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CRUD_Attendance;
