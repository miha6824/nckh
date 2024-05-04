import React from 'react';
import Navbar from '../Navbar/Navbar';
import './style.css';

const Homepage = () => {
    // Giả định lịch sử chấm công của nhân viên
    const attendanceHistory = [
        { date: '2024-04-01', status: 'Đi làm', checkIn: '08:00', checkOut: '17:00' },
        { date: '2024-04-02', status: 'Nghỉ có phép' },
        { date: '2024-04-03', status: 'Đi làm', checkIn: '08:15', checkOut: '17:30' },
        // Thêm dữ liệu khác tương tự ở đây
    ];


    return (
        <div className="homepage">
            <Navbar />
            <div className="attendance-history">
                <h2>Lịch sử chấm công</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Trạng thái</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceHistory.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.status}</td>
                                <td>{record.checkIn || '-'}</td>
                                <td>{record.checkOut || '-'}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default Homepage;
