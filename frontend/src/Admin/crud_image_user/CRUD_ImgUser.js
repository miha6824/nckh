import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CRUD_ImgUser.module.css';
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

function CRUD_ImgUser() {
    const [userImages, setUserImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);
    const usersPerPage = 5; // Hiển thị 5 ảnh trên mỗi trang

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
            setUserImages(userImages.filter(image => image.ID !== id));
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

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const offset = currentPage * usersPerPage;
    const filteredImages = userImages.filter(image =>
        image.UserName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedImages = filteredImages.reduce((acc, image) => {
        if (!acc[image.ID_User]) {
            acc[image.ID_User] = [];
        }
        acc[image.ID_User].push(image);
        return acc;
    }, {});

    const currentPageData = Object.keys(groupedImages).slice(offset, offset + usersPerPage).map(userId => ({
        userId,
        images: groupedImages[userId],
    }));

    const pageCount = Math.ceil(Object.keys(groupedImages).length / usersPerPage);

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">
                    <div className={styles.crudUserImgcontainer}>
                        <div className="d-flex justify-content-between mb-2 align-items-center">
                            <h2>Quản lý ảnh nhân viên</h2>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <Link to="/create_ImgUser" className={styles.addButton}>
                                    <FaPlus className={styles.icon} />
                                </Link>
                            </div>
                        </div>
                        <div className={styles.tableContainer}>
                            <table className={`table ${styles.table}`}>
                                <thead>
                                    <tr>
                                        <th>ID_User</th>
                                        <th>Họ và Tên</th>
                                        <th>Hình ảnh</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map(({ userId, images }) => (
                                        <tr key={userId}>
                                            <td>{userId}</td>
                                            <td>{images[0].UserName}</td>
                                            <td>
                                                <div className={styles.imageContainer}>
                                                    {images.slice(0, 1).map(image => (
                                                        <img
                                                            key={image.ID}
                                                            src={`http://localhost:8081/Images/${image.Image}`}
                                                            alt={image.UserName}
                                                            className={styles.image}
                                                        />
                                                    ))}
                                                    {images.length > 1 && (
                                                        <button onClick={() => toggleExpand(userId)} className={styles.viewMoreButton}>
                                                            <FaEye className={styles.icon} /> {expandedUserId === userId ? 'Thu gọn' : 'Xem thêm'}
                                                        </button>
                                                    )}
                                                    {expandedUserId === userId && images.slice(1).map(image => (
                                                        <div key={image.ID} className={styles.expandedImage}>
                                                            <img
                                                                src={`http://localhost:8081/Images/${image.Image}`}
                                                                alt={image.UserName}
                                                                className={styles.image}
                                                            />
                                                            <button className={`btn btn-danger ${styles['btn-danger']}`} onClick={() => handleDelete(image.ID)}>
                                                                <FaTrash className={styles.icon} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className={styles.actions}>
                                                <Link to={`/ImgUserAdd/${images[0].ID}`} className={`btn btn-primary mr-2 ${styles['btn-primary']}`}>
                                                    <FaPlus className={styles.icon} />
                                                </Link>
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

export default CRUD_ImgUser;
