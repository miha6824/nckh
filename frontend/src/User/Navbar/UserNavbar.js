import React, { useState, useEffect } from 'react';
import {
    CNavbar,
    CContainer,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CNavbarBrand,
    CNavLink,
    CNavItem,
    CNavbarNav,
    CCollapse,
    CNavbarToggler
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilUser,
    cilSettings,
    cilAccountLogout,
    cilBell,
    cilImage,
    cilClipboard
} from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import './UserNavbar.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/png-clipart-facial-recognition-system-computer-icons-face-detection-iris-recognition-scanner-blue-electronics.png'
import DefaultAvatar from '../../assets/avatarinUploadpage.png';

const AppNavbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('ID_user');
        navigate('/login');
    };

    return (
        <CNavbar expand="lg" colorScheme="dark" className="bg-dark custom-navbar">
            <CContainer fluid>
                <CNavbarBrand href="/home"><img src={logo} alt="Logo" style={{ height: 'auto', maxHeight: '50px' }} /></CNavbarBrand>
                <CCollapse className="navbar-collapse">
                    <CNavbarNav className="me-auto ms-5">
                        <CNavItem className="mx-3">
                            <CNavLink href="/UserWorkSchedule" className="nav-link-highlight">
                                <CIcon icon={cilClipboard} />
                                Lịch làm việc
                            </CNavLink>
                        </CNavItem>
                        <CNavItem className="mx-3">
                            <CNavLink href="/profile" className="nav-link-highlight">
                                <CIcon icon={cilUser} />
                                Thông tin cá nhân
                            </CNavLink>
                        </CNavItem>
                        <CNavItem className="mx-3">
                            <CNavLink href="/UploadPhotoPage" className="nav-link-highlight">
                                <CIcon icon={cilImage} />
                                Thêm ảnh xác thực
                            </CNavLink>
                        </CNavItem>
                    </CNavbarNav>
                    <div className="d-flex align-items-center mr-4">
                        <div>
                            <CIcon
                                icon={cilAccountLogout}
                                size="lg"
                                className="cursor-pointer text-white"
                                onClick={handleLogout}
                            />
                        </div>
                        <div className=".avatarContainer">
                            <div className="placeholderAvatar"><img src={DefaultAvatar} alt="Default Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            /></div>
                        </div>
                    </div>
                </CCollapse>
            </CContainer>
        </CNavbar>
    );
};

export default AppNavbar;
