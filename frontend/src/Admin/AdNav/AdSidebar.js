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

function AdSidebar() {
    return (
        <CSidebar className="vh-100 bg-dark" colorScheme="dark">
            <CSidebarHeader className="">
                <CNavbarBrand href="/home"><img src={logo} alt="Logo" style={{ height: 'auto', maxHeight: '40px', marginLeft: '10px' }} /></CNavbarBrand>
            </CSidebarHeader>
            <CSidebarNav>
                <CNavItem className="py-2.5" href="/FormReportComponent">
                    <CIcon customClassName="nav-icon" icon={cilFile} />
                    Báo cáo
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_Positions">
                    <CIcon customClassName="nav-icon" icon={cilBriefcase} />
                    Chức vụ
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_User">
                    <CIcon customClassName="nav-icon" icon={cilUser} />
                    Quản lý nhân viên
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_Department">
                    <CIcon customClassName="nav-icon" icon={cilBuilding} />
                    Quản lý phòng ban
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_Account">
                    <CIcon customClassName="nav-icon" icon={cilLockLocked} />
                    Quản lý tài khoản
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_ImgUser">
                    <CIcon customClassName="nav-icon" icon={cilImage} />
                    Quản lý ảnh nhân viên
                </CNavItem>
                <CNavItem className="py-2" href="/CRUD_Attendance">
                    <CIcon customClassName="nav-icon" icon={cilClock} />
                    Quản lý chấm công
                </CNavItem>
                <CNavItem className="py-2" href="/WorkSchedule">
                    <CIcon customClassName="nav-icon" icon={cilClipboard} />
                    Lịch làm việc
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    );
}

export default AdSidebar;
