import React from 'react';
import AdNavbar from '../Admin/AdNav/AdNavbar';
import AdSidebar from '../Admin/AdNav/AdSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <AdNavbar className={styles.navbar} />
            <div className={styles.content}>
                <AdSidebar className={styles.sidebar} />
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
