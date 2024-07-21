import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FormReportComponent.module.css';
import moment from 'moment';

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
        setSelectedEmployee('');
        setReportData(null);

        axios.get(`http://localhost:8081/employees/${ID}`)
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Error fetching employees:', error));
    };

    const handleEmployeeChange = (employeeID) => {
        setSelectedEmployee(employeeID);
        setReportData(null);
    };

    const handleGenerateReport = () => {
        const requestData = {
            department: selectedDepartment,
            employee: selectedEmployee === '' ? 'Tất cả nhân viên' : selectedEmployee,
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
        const requestData = {
            employee: selectedEmployee,
            startDate,
            endDate,
            departmentId: selectedDepartment
        };

        axios.post('http://localhost:8081/export-to-excel', requestData, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${selectedEmployee} ${startDate} đến ${endDate}.xlsx`;
                link.click();
            })
            .catch(error => console.error('Error exporting to Excel:', error));
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDateString = (dateString) => {
        return moment(dateString).format('YYYY-MM-DD');
    };

    return (
        <div className={styles.formReportContainer}>
            <div className={`d-flex flex-wrap align-items-center ${styles.formRow}`}>
                <div className={`${styles.formGroup}`}>
                    <label>Chọn phòng ban:</label>
                    <select value={selectedDepartment} onChange={(e) => handleDepartmentChange(e.target.value)}>
                        <option value="">-- Chọn phòng ban --</option>
                        {departments.map(department => (
                            <option key={department.ID} value={department.ID}>{department.TenPhongBan}</option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.formGroup}`}>
                    <label>Chọn nhân viên:</label>
                    <select value={selectedEmployee} onChange={(e) => handleEmployeeChange(e.target.value)}>
                        <option value="">-- Chọn nhân viên --</option>
                        <option value="Tất cả nhân viên">Tất cả nhân viên</option>
                        {employees.map(employee => (
                            <option key={employee.ID} value={employee.ID}>{employee.FullName}</option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.datePickerGroup}`}>
                    <label>Phạm vi thống kê:</label>
                    <div className={styles.datePickerContainer}>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <span> đến </span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className={`${styles.generateButtonContainer}`}>
                    <button className={`${styles.generateButton}`} onClick={handleGenerateReport}>Thống kê</button>
                </div>
            </div>
            {reportData && (
                <div className={`${styles.reportContainer}`}>
                    <div className={`${styles.reportHeader}`}>
                        <h2>Bảng chấm công</h2>
                        <button className={`${styles.exportButton}`} onClick={handleExportToExcel}>Xuất Excel</button>
                    </div>
                    {selectedEmployee === 'Tất cả nhân viên' ? (
                        <table className={`${styles.reportTable}`}>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Tổng thời gian đi trễ (phút)</th>
                                    <th>Tổng thời gian về sớm (phút)</th>
                                    <th>Tổng thời gian tăng ca (phút)</th>
                                    <th>Tổng thời gian làm việc</th>
                                    <th>Số công</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.FullName}</td>
                                        <td>{record.TotalLateMinutes}</td>
                                        <td>{record.TotalEarlyLeaveMinutes}</td>
                                        <td>{record.TotalOvertimeMinutes}</td>
                                        <td>{record.TotalWorkHours} giờ</td>
                                        <td>{record.TotalWorkDays}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className={`${styles.reportTable}`}>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Date</th>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                    <th>Late Minutes</th>
                                    <th>Early Leave Minutes</th>
                                    <th>Overtime Minutes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.FullName}</td>
                                        <td>{formatDateString(record.Date)}</td>
                                        <td>{formatTime(record.CheckIn)}</td>
                                        <td>{formatTime(record.CheckOut)}</td>
                                        <td>{record.LateMinutes}</td>
                                        <td>{record.EarlyLeaveMinutes}</td>
                                        <td>{record.OvertimeMinutes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormReportComponent;
