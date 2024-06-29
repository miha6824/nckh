import React, { useState } from 'react';
import axios from 'axios';

const TrainAndEvaluateButton = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleButtonClick = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8081/train_and_evaluate');
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error during training and evaluation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick} disabled={loading}>
                {loading ? 'Processing...' : 'Train and Evaluate'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default TrainAndEvaluateButton;
