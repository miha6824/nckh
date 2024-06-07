import React from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CNavbar, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSettings, cilAccountLogout, cilUser, cilMenu, cilBell, cilEnvelopeOpen } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import axios from 'axios';

function AdNavbar() {
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
        <>
            <CNavbar colorScheme="dark" className="bg-dark custom-navbar">
                <CContainer fluid className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <CIcon icon={cilMenu} size="lg" className="text-white me-3" />
                    </div>
                    <div className="d-flex align-items-center">
                        <CIcon icon={cilBell} size="lg" className="text-white me-3" />
                        <CIcon icon={cilEnvelopeOpen} size="lg" className="text-white me-3" />
                        <CDropdown>
                            <CDropdownToggle color="secondary">
                                <CIcon icon={cilUser} size="lg" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="/settings">
                                    <CIcon icon={cilSettings} className="me-2" />
                                    Settings
                                </CDropdownItem>
                                <CDropdownItem onClick={handleLogout}>
                                    <CIcon icon={cilAccountLogout} className="me-2" />
                                    Logout
                                </CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </CContainer>
            </CNavbar>
            <div style={{ backgroundColor: 'white', height: '4px' }}></div>
        </>
    );
}

export default AdNavbar;
