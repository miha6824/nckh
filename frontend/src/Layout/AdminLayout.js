import React from 'react';
import AdNavbar from '../Admin/AdNav/AdNavbar';
import AdSidebar from '../Admin/AdNav/AdSidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1  ">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
