import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavbar from '../Navbar/UserNavbar';
import styles from './home.module.css';

const Homepage = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            const userID = localStorage.getItem('ID_user');
            if (!userID) {
                setError("Không tìm thấy User ID trong localStorage");
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8081/attendance/${userID}`);
                setAttendanceData(res.data);
            } catch (err) {
                setError(err.response ? err.response.data : "Lỗi khi lấy dữ liệu chấm công");
                console.log(err);
            }
        };

        fetchAttendanceData();
    }, []);

    return (
        <div>
            <UserNavbar />
            <div className={styles.HomepageContainer}>
                <h2 className={styles.HomepageTitle}>Lịch sử chấm công</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <table className={styles.HomepageTable}>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Giờ vào</th>
                            <th>Giờ ra</th>
                            <th>Đi trễ (phút)</th>
                            <th>Về sớm (phút)</th>
                            <th>Làm thêm (phút)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((record, index) => (
                            <tr key={index}>
                                <td>{record.Date}</td>
                                <td>{record.CheckIn || 'N/A'}</td>
                                <td>{record.CheckOut || 'N/A'}</td>
                                <td>{record.LateMinutes || 0}</td>
                                <td>{record.EarlyLeaveMinutes || 0}</td>
                                <td>{record.OvertimeMinutes || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Homepage;
