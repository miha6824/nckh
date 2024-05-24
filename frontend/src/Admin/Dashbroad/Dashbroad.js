import React from 'react';
import AdNavbar from '../AdNav/AdNavbar';
import AdSidebar from '../AdNav/AdSidebar';


function Dashbroad(props) {
    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className="container-fluid vh-100 overflow-auto d-flex justify-content-center align-items-center">Dashbroad</div>
            </div>
        </div>
    );
}

export default Dashbroad;