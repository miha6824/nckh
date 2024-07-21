import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './AddAttendance.module.css';

function AddAttendance() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [checkinTime, setCheckinTime] = useState('');
    const [checkoutTime, setCheckoutTime] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/Crud_User')
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => console.log('Error fetching users:', err));
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('ID_User', selectedUser);
        formData.append('checkinTime', checkinTime);
        formData.append('checkoutTime', checkoutTime);
        formData.append('image', image);

        try {
            await axios.post('http://localhost:8081/addAttendance', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/CRUD_Attendance');
        } catch (err) {
            console.error('Error adding attendance:', err);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.addAttendanceContainer}>
            <div className={styles.backButton} onClick={handleGoBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <h2>Thêm chấm công</h2>
            <form onSubmit={handleSubmit} className={styles.attendanceForm}>
                <div className={styles.formGroup}>
                    <label>Chọn người:</label>
                    <select
                        className={styles.formControl}
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Chọn người</option>
                        {users.map(user => (
                            <option key={user.ID} value={user.ID}>{user.FullName}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Thời gian check-in:</label>
                    <input
                        type="datetime-local"
                        className={styles.formControl}
                        value={checkinTime}
                        onChange={(e) => setCheckinTime(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Thời gian check-out:</label>
                    <input
                        type="datetime-local"
                        className={styles.formControl}
                        value={checkoutTime}
                        onChange={(e) => setCheckoutTime(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Ảnh:</label>
                    <input
                        type="file"
                        className={styles.formControl}
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.btnPrimary}>Thêm</button>
            </form>
        </div>
    );
}

export default AddAttendance;
