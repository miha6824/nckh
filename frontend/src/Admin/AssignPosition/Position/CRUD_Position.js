import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import styles from './CRUD_Positions.module.css';
import { Link } from 'react-router-dom';
import CreatePosition from './CreatePosition';
import PositionUpdate from './UpdatePosition';

function CRUD_Position() {
    const [positions, setPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentPositionId, setCurrentPositionId] = useState(null);



    const positionsPerPage = 5;

    useEffect(() => {
        fetchPostions();
    }, []);

    const fetchPostions = () => {
        axios.get('http://localhost:8081/positions')
            .then(res => {
                setPositions(res.data);
            })
            .catch(err => console.log(err));
    };

    useEffect((fetchPostions) => {
        axios.get('http://localhost:8081/positions')
            .then(res => {
                const formattedPostion = res.data.map(item => ({
                    ...item,
                }));
                setPositions(formattedPostion);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8081/DeletePositions/${id}`);
            if (res.status === 200) {
                fetchPostions();
                setError(''); // Xóa lỗi khi thành công
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Lấy thông báo lỗi từ đối tượng lỗi
            } else {
                setError('Có lỗi xảy ra'); // Thông báo lỗi chung
                console.log(err);
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const offset = currentPage * positionsPerPage;
    const filteredPositions = positions.filter(data =>
        data.TenCV.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredPositions.slice(offset, offset + positionsPerPage);
    const pageCount = Math.ceil(filteredPositions.length / positionsPerPage);

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
        fetchPostions();
        setShowCreateForm(false);
    };

    const handleUpdateClick = (id) => {
        setCurrentPositionId(id);
        setShowUpdateForm(true);
    };

    const handleCloseUpdateForm = () => {
        setShowUpdateForm(false);
        setCurrentPositionId(null);
    };

    const handleUpdateSuccess = () => {
        fetchPostions();
        setShowUpdateForm(false);
        setCurrentPositionId(null);
    };


    return (
        <div className={`${styles.crudPositionsContainer} container-fluid`}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Chức vụ</h2>
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
            {error && <div className="text-danger mb-3">{error}</div>} {/* Chỉ render chuỗi lỗi */}
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>ID</th>
                            <th>Tên Chức Vụ</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {currentPageData.map((data, index) => (
                            <tr key={data.ID}>
                                <td>PB{data.ID}</td>
                                <td>{data.TenCV}</td>
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
            <div className={styles.paginationAndLinkContainer}>
                <Link to={'/Crud_PositionDetails'} className={`${styles.actionButton1} ${styles.naviButton}`}>
                    Chức vụ nhân viên
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
            {showCreateForm && (
                <div className={`${styles.createFormOverlay}`}>
                    <div className={`${styles.createForm}`}>
                        <button className={styles.closeButton} onClick={handleCloseCreateForm}>
                            <FaTimes />
                        </button>
                        <CreatePosition onClose={handleCloseCreateForm} onCreateSuccess={handleCreateSuccess} />
                    </div>
                </div>
            )}
            {showUpdateForm && (
                <div className={`${styles.createFormOverlay}`}>
                    <div className={`${styles.createForm}`}>
                        <button className={styles.closeButton} onClick={handleCloseUpdateForm}>
                            <FaTimes />
                        </button>
                        <PositionUpdate id={currentPositionId} onClose={handleCloseUpdateForm} onUpdateSuccess={handleUpdateSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CRUD_Position;
