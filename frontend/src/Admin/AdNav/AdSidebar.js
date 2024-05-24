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
        <CSidebar className="vh-100" unfoldable colorScheme="dark">
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand>CUI</CSidebarBrand>
            </CSidebarHeader>
            <CSidebarNav>
                <CNavTitle>Nav Title</CNavTitle>
                <CNavItem href="/home">
                    <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
                    Dashbroad
                </CNavItem>
                <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilPuzzle} /> Quản lý</>}>
                    <CNavItem href="/CRUD_User">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý nhân sự
                    </CNavItem>
                    <CNavItem href="/create_User">
                        <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                        Quản lý tài khoản
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
