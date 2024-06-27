import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdSidebar from '../AdNav/AdSidebar';
import AdNavbar from '../AdNav/AdNavbar';
import styles from './FormReportComponent.module.css';

const FormReportComponent = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/CRUD_Department')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    const handleDepartmentChange = (ID) => {
        setSelectedDepartment(ID);
        axios.get(`http://localhost:8081/employees/${ID}`)
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    };

    const handleGenerateReport = () => {
        const requestData = {
            department: selectedDepartment,
            employee: selectedEmployee,
            startDate,
            endDate
        };

        axios.post('http://localhost:8081/generate-report', requestData)
            .then(response => {
                setReportData(response.data);
            })
            .catch(error => console.error('Error generating report:', error));
    };

    const handleExportToExcel = () => {
        axios.post('http://localhost:8081/export-to-excel', reportData)
            .then(response => {
                console.log('Excel export successful:', response.data);
            })
            .catch(error => console.error('Error exporting to Excel:', error));
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="d-flex vh-100">
            <AdSidebar />
            <div className="d-flex flex-column flex-grow-1">
                <AdNavbar />
                <div className={`container-fluid vh-100 overflow-auto d-flex flex-column ${styles.formReportContainer}`}>
                    <div className={`d-flex ${styles.formRow}`}>
                        <div className={styles.formGroup}>
                            <label>Chọn phòng ban:</label>
                            <select value={selectedDepartment} onChange={(e) => handleDepartmentChange(e.target.value)}>
                                <option value="">-- Chọn phòng ban --</option>
                                {departments.map(department => (
                                    <option key={department.ID} value={department.ID}>{department.TenPhongBan}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Chọn nhân viên:</label>
                            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                                <option value="">-- Chọn nhân viên --</option>
                                {employees.map(employee => (
                                    <option key={employee.ID} value={employee.ID}>{employee.FullName}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.datePickerGroup}>
                            <label>Phạm vi báo cáo:</label>
                            <div className={styles.datePickerContainer}>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                <span> đến </span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                        <button className={styles.generateButton} onClick={handleGenerateReport}>Xem báo cáo</button>
                    </div>
                    {reportData && (
                        <div className={styles.reportContainer}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Full Name</th>
                                        <th>Date</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Đi trễ (phút)</th>
                                        <th>Về sớm (phút)</th>
                                        <th>Tăng ca (phút)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.ID_User}</td>
                                            <td>{record.FullName}</td>
                                            <td>{record.Date}</td>
                                            <td>{formatTime(record.CheckIn)}</td>
                                            <td>{formatTime(record.CheckOut)}</td>
                                            <td>{record.LateMinutes}</td>
                                            <td>{record.EarlyLeaveMinutes}</td>
                                            <td>{record.OvertimeMinutes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handleExportToExcel}>Xuất Excel</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormReportComponent;
