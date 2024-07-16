import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FaPlus, FaArrowLeft, FaArrowRight, FaEye, FaTimes } from 'react-icons/fa';
import styles from './CRUD_ImgUser.module.css';

function CRUD_ImgUser() {
    const [userImages, setUserImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);
    const usersPerPage = 6;

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_ImgUser')
            .then(res => {
                setUserImages(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/Delete_ImgUser/${id}`);
            setUserImages(userImages.filter(image => image.ImageID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const offset = currentPage * usersPerPage;
    const filteredUsers = userImages.filter(user =>
        user.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedUsers = filteredUsers.reduce((acc, user) => {
        if (!acc[user.UserID]) {
            acc[user.UserID] = [];
        }
        acc[user.UserID].push(user);
        return acc;
    }, {});

    const currentPageData = Object.keys(groupedUsers)
        .slice(offset, offset + usersPerPage)
        .map(userId => ({
            userId,
            userName: groupedUsers[userId][0].FullName,
            images: groupedUsers[userId].filter(user => user.ImageID !== null),
        }));

    const pageCount = Math.ceil(Object.keys(groupedUsers).length / usersPerPage);

    return (
        <div className={`${styles.crudUserImgContainer} container-fluid`}>
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h2>Quản lý ảnh nhân viên</h2>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Link to="/ImgUserAdd" className={styles.addButton}>
                        <FaPlus />
                    </Link>
                </div>
            </div>
            <div className={`${styles.tableContainer} table-responsive`}>
                <table className="table table-bordered">
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>ID_User</th>
                            <th>Họ và Tên</th>
                            <th>Hình ảnh</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map(({ userId, userName, images }) => (
                            <tr key={userId}>
                                <td>{userId}</td>
                                <td>{userName}</td>
                                <td>
                                    <div className={styles.imageContainer}>
                                        {expandedUserId === userId && (
                                            images.length > 0 ? (
                                                images.map(image => (
                                                    <div key={image.ImageID} className={styles.imageWrapper}>
                                                        <img
                                                            src={`http://localhost:8081/Images/${image.Image}`}
                                                            alt={userName}
                                                            className={styles.image}
                                                        />
                                                        <button onClick={() => handleDelete(image.ImageID)} className={styles.deleteButton}>
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.noImageText}>Chưa có ảnh</div>
                                            )
                                        )}
                                    </div>
                                </td>
                                <td className={styles.actions}>
                                    <Link to={`/ImgUserAdd/${userId}`} className={`${styles.actionButton} ${styles.addButton}`}>
                                        <FaPlus className={styles.icon} /> Thêm
                                    </Link>
                                    {images.length > 0 && (
                                        <button onClick={() => toggleExpand(userId)} className={`${styles.actionButton} ${styles.viewButton}`}>
                                            <FaEye className={styles.icon} /> {expandedUserId === userId ? 'Thu gọn' : 'Xem ảnh'}
                                        </button>
                                    )}
                                    {images.length === 0 && (
                                        <div className={styles.noImageText}>Chưa có ảnh</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {!currentPageData.length && (
                            <tr>
                                <td colSpan="4" className="text-center">Không có dữ liệu phù hợp</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.paginationContainer}>
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
}

export default CRUD_ImgUser;
