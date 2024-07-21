import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import styles from './UserWorkSchedule.module.css';

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

            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                if (dayOfWeek === 1 && currentWeek.length > 0) {
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
        <div className={styles.scheduleContainer}>
            <div className={styles.controlsContainer}>
                <div className={styles.controlGroup}>
                    <label htmlFor="month">Tháng:</label>
                    <input
                        type="number"
                        id="month"
                        name="month"
                        value={month}
                        onChange={handleMonthChange}
                        min="1"
                        max="12"
                        className={styles.formControl}
                    />
                </div>
                <div className={styles.controlGroup}>
                    <label htmlFor="year">Năm:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={year}
                        onChange={handleYearChange}
                        className={styles.formControl}
                    />
                </div>
            </div>
            <div className={styles.weekContainer}>
                {groupByWeek().map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.week}>
                        <div className={styles.weekHeader}>Tuần {weekIndex + 1}</div>
                        <div className={styles.daysContainer}>
                            {week.map((day, dayIndex) => (
                                <div key={dayIndex} className={`${styles.day} ${selectedDay === day.date ? styles.selected : ''}`} onClick={() => handleDayClick(day.date)}>
                                    <div className={styles.date}>
                                        <FaCalendarAlt /> {moment(day.date).format('DD/MM/YYYY')}
                                    </div>
                                    <div className={styles.time}>
                                        <FaClock /> Giờ vào: {day.checkin_time}
                                    </div>
                                    <div className={styles.time}>
                                        <FaClock /> Giờ ra: {day.checkout_time}
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
