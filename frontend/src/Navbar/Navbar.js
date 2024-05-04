import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faComments, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './style.css';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [language, setLanguage] = useState('vi'); // Mặc định ngôn ngữ là tiếng Việt

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLanguageChange = () => {
        const newLanguage = language === 'vi' ? 'en' : 'vi'; // Chuyển đổi ngôn ngữ
        setLanguage(newLanguage);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/home">{language === 'vi' ? 'Logo' : 'Logo'}</Link> {/* Thay đổi nội dung của logo */}
            </div>
            <ul className="nav-links">
                <li><Link to="/attendance">{language === 'vi' ? 'Chấm công' : 'Attendance'}</Link></li> {/* Thay đổi nội dung của các liên kết */}
                <li><Link to="/tasks">{language === 'vi' ? 'Công việc' : 'Tasks'}</Link></li>
                <li><Link to="/customers">{language === 'vi' ? 'Khách hàng' : 'Customers'}</Link></li>
            </ul>
            <div className="icons">
                <div className='languagetrans'>
                    <li onClick={handleLanguageChange}>{language === 'vi' ? 'English' : 'Tiếng Việt'}</li> {/* Thêm nút chuyển đổi ngôn ngữ */}
                </div>
                <div className="notification-icon">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <div className="chat-icon">
                    <FontAwesomeIcon icon={faComments} />
                </div>
                <div className="avatar" onClick={handleDropdownToggle}>
                    <FontAwesomeIcon icon={faUserCircle} />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <ul>
                                <li><Link to="/profile">{language === 'vi' ? 'Thông tin cá nhân' : 'Profile'}</Link></li>
                                <li><Link to="/logout">{language === 'vi' ? 'Đăng xuất' : 'Logout'}</Link></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
