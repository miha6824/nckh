import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CRUD_Attendance.module.css';
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function CRUD_Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const attendancesPerPage = 4; // Hiển thị 5 chấm công trên mỗi trang

    useEffect(() => {
        console.log('Fetching attendance data...');
        axios.get('http://localhost:8081/CRUD_Attendance')
            .then(res => {
                console.log('Attendance data fetched:', res.data);
                setAttendanceData(res.data);
            })
            .catch(err => console.log('Error fetching attendance data:', err));
    }, []);

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting attendance record with ID: ${id}`);
            await axios.delete(`http://localhost:8081/Delete_atten/${id}`);
            setAttendanceData(attendanceData.filter(data => data.ID !== id));
            console.log(`Deleted attendance record with ID: ${id}`);
        } catch (err) {
            console.log('Error deleting attendance record:', err);
        }
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        console.log('Page selected:', selectedPage);
        setCurrentPage(selectedPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        console.log('Search term changed:', event.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    const offset = currentPage * attendancesPerPage;
    const filteredAttendances = attendanceData.filter(data =>
        data.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredAttendances.slice(offset, offset + attendancesPerPage);
    const pageCount = Math.ceil(filteredAttendances.length / attendancesPerPage);

    console.log('Current page data:', currentPageData);

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
                                    <FaPlus />
                                </Link>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={`table ${styles.table}`}>
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>ID Người dùng</th>
                                        <th>Thời gian</th>
                                        <th>Ảnh</th>
                                        <th>Trạng thái</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map((data, index) => {
                                        console.log(`Rendering row ${index} for data ID: ${data.ID}`);
                                        return (
                                            <tr key={data.ID}>
                                                <td>{data.FullName}</td>
                                                <td>{data.ID_User}</td>
                                                <td>{moment(data.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                <td>
                                                    <img src={data.Image} alt={`attendance_${data.ID}`} className={styles.image} />
                                                </td>
                                                <td>{data.Status}</td>
                                                <td className={styles.actions}>
                                                    <button className={`btn btn-danger ${styles['btn-danger']}`} onClick={() => handleDelete(data.ID)}>
                                                        <FaTrash className={styles.icon} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                </div>
            </div>
        </div>
    );
}

export default CRUD_Attendance;
