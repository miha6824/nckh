import React, { useState } from 'react';
import {
    CSidebar,
    CSidebarHeader,
    CSidebarBrand,
    CSidebarNav,
    CNavTitle,
    CNavItem,
    CNavGroup,
    CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilPuzzle, cilCloudDownload, cilLayers } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';

function AdSidebar() {
    return (
        <CSidebar className="vh-100 bg-dark" colorScheme="dark">
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand>CUI</CSidebarBrand>
            </CSidebarHeader>
            <CSidebarNav>
                <CNavTitle>Nav Title</CNavTitle>
                <CNavItem href="/FormReportComponent">
                    <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                    In báo cáo
                </CNavItem>
                <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilPuzzle} /> Quản lý</>}>
                    <CNavItem href="/CRUD_User">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý nhân sự
                    </CNavItem>
                    <CNavItem href="/CRUD_Account">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý tài khoản
                    </CNavItem>
                    <CNavItem href="/CRUD_Department">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý phòng ban
                    </CNavItem>
                    <CNavItem href="/CRUD_ImgUser">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý ảnh nhân viên
                    </CNavItem>
                    <CNavItem href="/CRUD_Attendance">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý chấm công
                    </CNavItem>
                    <CNavItem href="/AttendanceSettings">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Lịch làm việc
                    </CNavItem>
                </CNavGroup>
                <CNavItem href="https://coreui.io">
                    <CIcon customClassName="nav-icon" icon={cilCloudDownload} />
                    Download CoreUI
                </CNavItem>
                <CNavItem href="https://coreui.io/pro/">
                    <CIcon customClassName="nav-icon" icon={cilLayers} />
                    Try CoreUI PRO
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    );
}

export default AdSidebar;
