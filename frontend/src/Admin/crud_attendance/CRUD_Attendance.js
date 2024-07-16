import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ReactPaginate from 'react-paginate';
import 'react-lazy-load-image-component/src/effects/blur.css';
import styles from './CRUD_Attendance.module.css';

function CRUD_Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const attendancesPerPage = 4;

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = () => {
        axios.get('http://localhost:8081/CRUD_Attendance')
            .then(res => {
                setAttendanceData(res.data);
            })
            .catch(err => console.log('Error fetching attendance data:', err));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_atten/${id}`);
            setAttendanceData(attendanceData.filter(data => data.ID !== id));
        } catch (err) {
            console.log('Error deleting attendance record:', err);
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
        data.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredAttendances.slice(offset, offset + attendancesPerPage);
    const pageCount = Math.ceil(filteredAttendances.length / attendancesPerPage);

    return (
        <div className={`${styles.crudAttendanceContainer} container-fluid`}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Quản lý chấm công</h2>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Link to="/AddAttendance" className={styles.addButton}>
                        <FaPlus />
                    </Link>
                </div>
            </div>
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Họ Và Tên</th>
                            <th>Thời gian</th>
                            <th>Ảnh</th>
                            <th>Trạng thái</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map(data => (
                            <tr key={data.ID}>
                                <td>{data.FullName}</td>
                                <td>{moment(data.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                                <td>
                                    <LazyLoadImage
                                        alt={`attendance_${data.ID}`}
                                        src={data.Image}
                                        effect="blur"
                                        className={styles.image}
                                    />
                                </td>
                                <td>{data.Status}</td>
                                <td className={styles.actions}>
                                    <button className={`btn btn-danger ${styles['btn-danger']}`} onClick={() => handleDelete(data.ID)}>
                                        <FaTrash className={styles.icon} /> Xoá
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
        </div>
    );
}

export default CRUD_Attendance;
