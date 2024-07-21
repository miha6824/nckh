import React, { useState } from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CNavbar, CContainer, CNavbarBrand, CCollapse, CNavItem, CNavLink, CNavbarNav } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAccountLogout, cilUser, cilFile, cilBriefcase, cilBuilding, cilClock, cilClipboard, cilLockLocked, cilImage, cilMenu } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useNavigate } from 'react-router-dom';
import styles from './AdNavbar.module.css';
import logo from '../../assets/png-clipart-facial-recognition-system-computer-icons-face-detection-iris-recognition-scanner-blue-electronics.png';
import DefaultAvatar from '../../assets/avatarinUploadpage.png';

function AdNavbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('ID_user');
        navigate('/login');
    };

    return (
        <CNavbar expand="lg" className={styles.customNavbar}>
            <CContainer fluid>
                <CNavbarBrand href="/" className={styles.logoBrand}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </CNavbarBrand>
                <CCollapse className="navbar-collapse">
                    <div className="d-flex align-items-center justify-content-end w-100">
                        <CIcon icon={cilAccountLogout} size="lg" className="cursor-pointer text-white me-3" onClick={handleLogout} />
                        <div className={`${styles.avatarContainer} d-flex align-items-center`}>
                            <div className={styles.placeholderAvatar}>
                                <img src={DefaultAvatar} alt="Default Avatar" className={styles.avatar} />
                            </div>
                        </div>
                    </div>
                </CCollapse>

                <CDropdown className="d-lg-none">
                    <CDropdownToggle className={`${styles.dropdownToggle}`}>
                        <CIcon icon={cilMenu} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu className={`${styles.dropdownMenu}`}>
                        <CDropdownItem href="/FormReportComponent" className={styles.dropdownItem}>Báo cáo</CDropdownItem>
                        <CDropdownItem href="/CRUD_PositionDetails" className={styles.dropdownItem}>Chức vụ</CDropdownItem>
                        <CDropdownItem href="/CRUD_User" className={styles.dropdownItem}>Quản lý nhân viên</CDropdownItem>
                        <CDropdownItem href="/CRUD_Department" className={styles.dropdownItem}>Quản lý phòng ban</CDropdownItem>
                        <CDropdownItem href="/CRUD_Account" className={styles.dropdownItem}>Quản lý tài khoản</CDropdownItem>
                        <CDropdownItem href="/CRUD_ImgUser" className={styles.dropdownItem}>Quản lý ảnh nhân viên</CDropdownItem>
                        <CDropdownItem href="/CRUD_Attendance" className={styles.dropdownItem}>Quản lý chấm công</CDropdownItem>
                        <CDropdownItem href="/WorkSchedule" className={styles.dropdownItem}>Lịch làm việc</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CContainer>
        </CNavbar >
    );
}

export default AdNavbar;
