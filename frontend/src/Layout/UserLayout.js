import React from 'react';
import UserNavbar from '../User/Navbar/UserNavbar';
import styles from './UserLayout.module.css';

const UserLayout = ({ children }) => {
    return (
        <div className={styles.userLayout}>
            <UserNavbar className={styles.userNavbar} />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default UserLayout;
