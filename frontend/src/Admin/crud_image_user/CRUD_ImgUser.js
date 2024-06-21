import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './CRUD_ImgUser.module.css';
import { FaTrash, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

function CRUD_ImgUser() {
    const [userImages, setUserImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
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

    const offset = currentPage * usersPerPage;
    const filteredImages = userImages.filter(image =>
        image.UserName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentPageData = filteredImages.slice(offset, offset + usersPerPage);
    const pageCount = Math.ceil(filteredImages.length / usersPerPage);

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
                                        <th>ID</th>
                                        <th>Họ và Tên</th>
                                        <th>Hình ảnh</th>
                                        <th>ID_User</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.map(image => (
                                        <tr key={image.ID}>
                                            <td>{image.ID}</td>
                                            <td>{image.UserName}</td>
                                            <td>
                                                {image.Image && <img src={`http://localhost:8081/Images/${image.Image}`} alt={image.UserName} className={styles.image} />}
                                            </td>
                                            <td>{image.ID_User}</td>
                                            <td className={styles.actions}>
                                                <Link to={`/ImgUserAdd/${image.ID}`} className={`btn btn-primary mr-2 ${styles['btn-primary']}`}>
                                                    <FaPlus className={styles.icon} />
                                                </Link>
                                                <button className={`btn btn-danger ${styles['btn-danger']}`} onClick={() => handleDelete(image.ID)}>
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
