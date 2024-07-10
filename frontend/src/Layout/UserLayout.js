// UserLayout.js
import React from 'react';
import UserNavbar from '../User/Navbar/UserNavbar'

const UserLayout = ({ children }) => {
    return (
        <div className="user-layout">
            <UserNavbar />
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default UserLayout;
