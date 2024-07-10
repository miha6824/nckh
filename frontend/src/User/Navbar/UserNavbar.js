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
    cilClock,
    cilTask,
    cilPeople
} from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import './UserNavbar.css'; // Import file CSS tùy chỉnh
import axios from 'axios';

const AppNavbar = () => {

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout', { withCredentials: true })
            .then(res => {
                window.location.href = '/login';
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <CNavbar expand="lg" colorScheme="dark" className="bg-dark custom-navbar">
            <CContainer fluid>
                <CNavbarBrand href="/home">Logo</CNavbarBrand>
                <CNavbarToggler aria-label="Toggle navigation" />
                <CCollapse className="navbar-collapse">
                    <CNavbarNav className="me-auto ms-5">
                        <CNavItem className="mx-3">
                            <CNavLink href="/tasks" className="nav-link-highlight">
                                <CIcon icon={cilTask} className="me-2" />
                                Công việc
                            </CNavLink>
                        </CNavItem>
                        <CNavItem className="mx-3">
                            <CNavLink href="/clients" className="nav-link-highlight">
                                <CIcon icon={cilPeople} className="me-2" />
                                Khách hàng
                            </CNavLink>
                        </CNavItem>
                    </CNavbarNav>
                    <div className="d-flex align-items-center">
                        <CIcon icon={cilBell} size="lg" className="me-3 text-white" />
                        {/* <span className="text-white me-3">{userName}</span> */}
                        <CDropdown>
                            <CDropdownToggle color="secondary">
                                <CIcon icon={cilUser} size="lg" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="/profile">
                                    <CIcon icon={cilUser} className="me-2" />
                                    Thông tin cá nhân
                                </CDropdownItem>
                                <CDropdownItem href="/change-password">
                                    <CIcon icon={cilSettings} className="me-2" />
                                    Đổi mật khẩu
                                </CDropdownItem>
                                <CDropdownItem href="/UploadPhotoPage">
                                    <CIcon icon={cilUser} className="me-2" />
                                    Thêm ảnh xác thực
                                </CDropdownItem>
                                <CDropdownItem onClick={handleLogout}>
                                    <CIcon icon={cilAccountLogout} className="me-2" />
                                    Đăng xuất
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </CCollapse>
            </CContainer>
        </CNavbar>
    );
};

export default AppNavbar;
