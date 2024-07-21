import React from 'react';
import {
    CSidebar,
    CSidebarHeader,
    CNavbarBrand,
    CSidebarNav,
    CNavItem,
    CNavGroup,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilUser, cilFile, cilBriefcase, cilBuilding, cilClock, cilClipboard, cilLockLocked, cilImage } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import logo from '../../assets/png-clipart-facial-recognition-system-computer-icons-face-detection-iris-recognition-scanner-blue-electronics.png'
import styles from './AdSidebar.module.css'

function AdSidebar() {
    return (
        <CSidebar className={styles.customNavbar}>
            <CSidebarNav >
                <CNavItem className={styles.navItemText} href="/FormReportComponent">
                    <CIcon customClassName={styles.navIcon} icon={cilFile} />
                    Báo cáo
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_PositionDetails">
                    <CIcon customClassName={styles.navIcon} icon={cilBriefcase} />
                    Chức vụ
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_User">
                    <CIcon customClassName={styles.navIcon} icon={cilUser} />
                    Quản lý nhân viên
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_Department">
                    <CIcon customClassName={styles.navIcon} icon={cilBuilding} />
                    Quản lý phòng ban
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_Account">
                    <CIcon customClassName={styles.navIcon} icon={cilLockLocked} />
                    Quản lý tài khoản
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_ImgUser">
                    <CIcon customClassName={styles.navIcon} icon={cilImage} />
                    Quản lý ảnh nhân viên
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/CRUD_Attendance">
                    <CIcon customClassName={styles.navIcon} icon={cilClock} />
                    Quản lý chấm công
                </CNavItem>
                <CNavItem className={styles.navItemText} href="/WorkSchedule">
                    <CIcon customClassName={styles.navIcon} icon={cilClipboard} />
                    Lịch làm việc
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    );
}

export default AdSidebar;
