import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import '@coreui/coreui/dist/css/coreui.min.css';
import styles from './WorkSchedule.module.css';

const WorkSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [month, setMonth] = useState(moment().month() + 1);
    const [year, setYear] = useState(moment().year());

    useEffect(() => {
        axios.get('http://localhost:8081/getStandardTimes', {
            params: { month, year }
        })
            .then(res => {
                console.log("API response:", res.data);
                setSchedule(res.data);
            })
            .catch(err => console.log(err));
    }, [month, year]);

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="form-group">
                <label htmlFor="month">Month:</label>
                <input
                    type="number"
                    id="month"
                    name="month"
                    value={month}
                    onChange={handleMonthChange}
                    min="1"
                    max="12"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="year">Year:</label>
                <input
                    type="number"
                    id="year"
                    name="year"
                    value={year}
                    onChange={handleYearChange}
                    className="form-control"
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Check-in Time</th>
                        <th>Check-out Time</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((day, index) => (
                        <tr key={index}>
                            <td>{day.date}</td>
                            <td>{day.checkin_time}</td>
                            <td>{day.checkout_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WorkSchedule;
