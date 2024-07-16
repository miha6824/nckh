import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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

    return (
        <div className={styles.addAttendanceContainer}>
            <h2>Thêm chấm công</h2>
            <form onSubmit={handleSubmit} className={styles.attendanceForm}>
                <div className="form-group">
                    <label>Chọn người:</label>
                    <select
                        className="form-control"
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
                <div className="form-group">
                    <label>Thời gian check-in:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={checkinTime}
                        onChange={(e) => setCheckinTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Thời gian check-out:</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={checkoutTime}
                        onChange={(e) => setCheckoutTime(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ảnh:</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Thêm</button>
                <Link to="/CRUD_Attendance" className="btn btn-secondary ml-2">
                    <FaArrowLeft /> Quay lại
                </Link>
            </form>
        </div>
    );
}

export default AddAttendance;
