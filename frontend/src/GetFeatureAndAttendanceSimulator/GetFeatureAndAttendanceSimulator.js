import React, { useState } from 'react';
import axios from 'axios';

const GetFeatureAndAttendanceSimulator = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleButtonClick = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8081/getFeature_and_attendanceSimulator');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'lỗi khi giả lập chấm công');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick} disabled={loading}>
                {loading ? 'Processing...' : 'getFeature and attendanceSimulator'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default GetFeatureAndAttendanceSimulator;
