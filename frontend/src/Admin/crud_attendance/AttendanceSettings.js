import React, { useState } from 'react';
import axios from 'axios';

const AttendanceSettings = () => {
    const [date, setDate] = useState('');
    const [checkinTime, setCheckinTime] = useState('');
    const [checkoutTime, setCheckoutTime] = useState('');
    const [userId, setUserId] = useState('');
    const [fullName, setFullName] = useState('');
    const [imageBase64, setImageBase64] = useState('');

    const handleSetStandardTimes = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/setStandardTimes', {
                date,
                checkinTime,
                checkoutTime
            });
            alert(response.data.message);
        } catch (error) {
            alert('Lỗi khi thiết lập giờ tiêu chuẩn');
        }
    };

    const handleFileChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageBase64(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <div>
            <h1>Thiết lập giờ tiêu chuẩn</h1>
            <form onSubmit={handleSetStandardTimes}>
                <label>
                    Ngày:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
                <br />
                <label>
                    Giờ check-in:
                    <input type="time" value={checkinTime} onChange={(e) => setCheckinTime(e.target.value)} required />
                </label>
                <br />
                <label>
                    Giờ check-out:
                    <input type="time" value={checkoutTime} onChange={(e) => setCheckoutTime(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Thiết lập giờ tiêu chuẩn</button>
            </form>
        </div>
    );
};

export default AttendanceSettings;
