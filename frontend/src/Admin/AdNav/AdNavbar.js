import React from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CNavbar, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAccountLogout, cilUser } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import { useNavigate } from 'react-router-dom';

function AdNavbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('ID_user');
        navigate('/login');
    };
    return (
        <>
            <CNavbar colorScheme="dark" className="bg-dark custom-navbar">
                <CContainer fluid className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                    </div>
                    <div className="d-flex align-items-center ">
                        <CDropdown>
                            <CDropdownToggle color="secondary">
                                <CIcon icon={cilUser} size="lg" />
                            </CDropdownToggle>
                            <CDropdownMenu>
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
