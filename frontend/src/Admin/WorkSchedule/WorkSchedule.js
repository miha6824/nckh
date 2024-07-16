import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import styles from './WorkSchedule.module.css';
import { Link } from 'react-router-dom';

const WorkSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [month, setMonth] = useState(moment().month() + 1);
    const [year, setYear] = useState(moment().year());
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8081/getStandardTimes', {
            params: { month, year }
        })
            .then(res => {
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

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const groupByWeek = () => {
        let weeks = [];
        let currentWeek = [];

        const sortedSchedule = [...schedule].sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

        sortedSchedule.forEach(day => {
            const dayOfWeek = moment(day.date).isoWeekday();

            if (dayOfWeek >= 2 && dayOfWeek <= 6) {
                if (dayOfWeek === 2 && currentWeek.length > 0) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                }

                currentWeek.push(day);
            }
        });

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    };

    return (
        <div className={styles['schedule-container']}>
            <div className={styles['controls-container']}>
                <div className={styles['control-group']}>
                    <label htmlFor="month">Tháng:</label>
                    <input
                        type="number"
                        id="month"
                        name="month"
                        value={month}
                        onChange={handleMonthChange}
                        min="1"
                        max="12"
                        className={styles['form-control']}
                    />
                </div>
                <div className={styles['control-group']}>
                    <label htmlFor="year">Năm:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={year}
                        onChange={handleYearChange}
                        className={styles['form-control']}
                    />
                </div>
                <Link to={'/AttendanceSettings'} className={styles['schedule-button']}>Đặt lịch chấm công</Link>
            </div>
            <div className={styles['week-container']}>
                {groupByWeek().map((week, weekIndex) => (
                    <div key={weekIndex} className={styles['week']}>
                        <div className={styles['week-header']}>Tuần {weekIndex + 1}</div>
                        <div className={styles['days-container']}>
                            {week.map((day, dayIndex) => (
                                <div key={dayIndex} className={`${styles['day']} ${selectedDay === day.date ? styles['selected'] : ''}`} onClick={() => handleDayClick(day.date)}>
                                    <div className={styles['date']}>{moment(day.date).format('DD/MM/YYYY')}</div>
                                    <div className={styles['time']}>
                                        <div>Check-in: {day.checkin_time}</div>
                                        <div>Check-out: {day.checkout_time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkSchedule;
