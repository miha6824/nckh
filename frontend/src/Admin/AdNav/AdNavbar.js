import React from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CNavbar, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSettings, cilAccountLogout, cilUser } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';

function AdNavbar() {
    return (
        <CNavbar colorScheme="dark" >
            <CContainer fluid>
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
