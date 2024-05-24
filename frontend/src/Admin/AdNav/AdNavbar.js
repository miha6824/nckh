import React, { useState } from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CNavbar, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSettings, cilAccountLogout, cilUser } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import './AdNavbar.css'; // Import file CSS tùy chỉnh

function AdNavbar() {
    const [userName, setUserName] = useState('');
    return (
        <CNavbar colorScheme="dark" className="bg-dark custom-navbar">
            <CContainer fluid>
                <span className="text-white me-3">{userName}</span>
                <CDropdown className="ms-auto">
                    <CDropdownToggle color="secondary">
                        <CIcon icon={cilUser} size="lg" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem href="/settings">
                            <CIcon icon={cilSettings} className="me-2" />
                            Settings
                        </CDropdownItem>
                        <CDropdownItem href="/logout">
                            <CIcon icon={cilAccountLogout} className="me-2" />
                            Logout
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            </CContainer>
        </CNavbar>
    );
}

export default AdNavbar;
