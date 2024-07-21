import React, { useState } from 'react';
import {
    CNavbar,
    CContainer,
    CNavbarBrand,
    CNavLink,
    CNavItem,
    CNavbarNav,
    CCollapse,
    CButton,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilUser,
    cilAccountLogout,
    cilImage,
    cilClipboard,
    cilMenu
} from '@coreui/icons';
import styles from './UserNavbar.module.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/png-clipart-facial-recognition-system-computer-icons-face-detection-iris-recognition-scanner-blue-electronics.png';
import DefaultAvatar from '../../assets/avatarinUploadpage.png';

const UserNavbar = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('ID_user');
        navigate('/login');
    };

    const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

    return (
        <CNavbar expand="lg" colorScheme="dark" className={`${styles.bgDark} ${styles.customNavbar}`}>
            <CContainer fluid>
                <CNavbarBrand href="/home">
                    <img src={logo} alt="Logo" className={styles.logoBrand} />
                </CNavbarBrand>
                <CButton
                    className={`d-lg-none ${styles.dropdownToggle}`}
                    onClick={toggleNavbar}
                    aria-controls="navbar-collapse"
                    aria-expanded={isNavbarOpen}
                >
                </CButton>
                <CCollapse id="navbar-collapse" className={`navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
                    <CNavbarNav className={`${styles.navbarNav} me-auto ${styles.ms5}`}>
                        <CNavItem className={styles.mx3}>
                            <CNavLink href="/UserWorkSchedule" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
                                <CIcon icon={cilClipboard} />
                                Lịch làm việc
                            </CNavLink>
                        </CNavItem>
                        <CNavItem className={styles.mx3}>
                            <CNavLink href="/profile" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
                                <CIcon icon={cilUser} />
                                Thông tin cá nhân
                            </CNavLink>
                        </CNavItem>
                        <CNavItem className={styles.mx3}>
                            <CNavLink href="/UploadPhotoPage" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
                                <CIcon icon={cilImage} />
                                Thêm ảnh xác thực
                            </CNavLink>
                        </CNavItem>
                    </CNavbarNav>
                    <div className={`d-lg-flex ${styles.avatarContainer}`}>
                        <CIcon
                            icon={cilAccountLogout}
                            size="lg"
                            className={styles.textWhite}
                            onClick={handleLogout}
                        />
                        <div className={styles.placeholderAvatar}>
                            <img
                                src={DefaultAvatar}
                                alt="Default Avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </CCollapse>

                <CDropdown className="d-lg-none">
                    <CDropdownToggle className={`${styles.dropdownToggle}`}>
                        <CIcon icon={cilMenu} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu className={`${styles.dropdownMenu}`}>
                        <CDropdownItem href="/UserWorkSchedule" className={styles.dropdownItem}>
                            <CIcon icon={cilClipboard} />
                            Lịch làm việc
                        </CDropdownItem>
                        <CDropdownItem href="/profile" className={styles.dropdownItem}>
                            <CIcon icon={cilUser} />
                            Thông tin cá nhân
                        </CDropdownItem>
                        <CDropdownItem href="/UploadPhotoPage" className={styles.dropdownItem}>
                            <CIcon icon={cilImage} />
                            Thêm ảnh xác thực
                        </CDropdownItem>
                        <CDropdownItem onClick={handleLogout} className={styles.dropdownItem}>
                            <CIcon icon={cilAccountLogout} />
                            Đăng xuất
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CContainer>
        </CNavbar>
    );
};

export default UserNavbar;
