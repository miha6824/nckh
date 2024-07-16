import React, { useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './AttendanceSettings.module.css';

const AttendanceSettings = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [checkinTime, setCheckinTime] = useState('');
    const [checkoutTime, setCheckoutTime] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSetStandardTimes = async (e) => {
        e.preventDefault();
        const formattedDate = formatDate(selectedDate); // Sử dụng hàm formatDate để định dạng ngày
        try {
            const response = await axios.post('http://localhost:8081/setStandardTimes', {
                date: formattedDate,
                checkinTime,
                checkoutTime
            });
            alert(response.data.message);
        } catch (error) {
            alert('Lỗi khi thiết lập giờ tiêu chuẩn');
        }
    };

    // Hàm định dạng ngày tháng thành chuỗi YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng tính từ 0, cộng thêm 1 và chuẩn hóa độ dài
        const day = date.getDate().toString().padStart(2, '0'); // Ngày trong tháng và chuẩn hóa độ dài
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <h1 className={styles.title}>Thiết lập giờ làm việc</h1>
            <div className={styles.calendarContainer}>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    locale="vi-VN"
                    className={styles.reactCalendar}
                />
            </div>
            <form onSubmit={handleSetStandardTimes} className={styles.formContainer}>
                <label className={styles.label}>
                    Ngày: {selectedDate.toLocaleDateString('vi-VN')}
                </label>
                <label className={styles.label}>
                    Giờ check-in:
                    <input type="time" value={checkinTime} onChange={(e) => setCheckinTime(e.target.value)} required className={styles.input} />
                </label>
                <label className={styles.label}>
                    Giờ check-out:
                    <input type="time" value={checkoutTime} onChange={(e) => setCheckoutTime(e.target.value)} required className={styles.input} />
                </label>
                <button type="submit" className={`${styles.submitButton} btn btn-primary`}>Thiết lập giờ tiêu chuẩn</button>
            </form>
        </div>
    );
};

export default AttendanceSettings;
