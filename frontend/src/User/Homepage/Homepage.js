import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
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
                console.error(err);
            }
        };

        fetchAttendanceData();
    }, []);

    const formatTime = (time) => {
        return time ? time : 'N/A';
    };

    return (
        <div className={styles.homepageContainer}>
            <h2 className={styles.homepageTitle}>Lịch sử chấm công</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <table className={styles.homepageTable}>
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
                        <tr key={index} className={styles.tableRow}>
                            <td>{record.Date}</td>
                            <td>{formatTime(record.CheckIn)}</td>
                            <td>{formatTime(record.CheckOut)}</td>
                            <td>
                                {record.LateMinutes ? (
                                    <span className={`${styles.statusIcon} ${styles.late}`}>
                                        <FaTimesCircle />
                                        <span className={styles.timeValue}>{record.LateMinutes}</span>
                                    </span>
                                ) : (
                                    <span className={`${styles.statusIcon} ${styles.onTime}`}>
                                        <FaCheckCircle />
                                        <span className={styles.timeValue}>0</span>
                                    </span>
                                )}
                            </td>
                            <td>
                                {record.EarlyLeaveMinutes ? (
                                    <span className={`${styles.statusIcon} ${styles.earlyLeave}`}>
                                        <FaTimesCircle />
                                        <span className={styles.timeValue}>{record.EarlyLeaveMinutes}</span>
                                    </span>
                                ) : (
                                    <span className={`${styles.statusIcon} ${styles.onTime}`}>
                                        <FaCheckCircle />
                                        <span className={styles.timeValue}>0</span>
                                    </span>
                                )}
                            </td>
                            <td className={styles.statusIcon}>
                                {record.OvertimeMinutes ? (
                                    <>
                                        <FaClock />
                                        <span className={styles.timeValue}>{record.OvertimeMinutes}</span>
                                    </>
                                ) : (
                                    'Không tăng ca'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Homepage;
