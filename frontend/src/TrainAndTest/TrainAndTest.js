// TrainAndSimulate.js
import React from 'react';
import axios from 'axios';

const TrainAndSimulate = () => {
    const handleTrainAndSimulate = async () => {
        try {
            const response = await axios.post('http://localhost:8081/train_and_evaluate');
            alert(response.data.message);
        } catch (error) {
            console.error('Error during training and attendance simulation:', error);
            alert('Error during training and attendance simulation');
        }
    };

    return (
        <div>
            <button onClick={handleTrainAndSimulate}>Train and eveluate</button>
        </div>
    );
};

export default TrainAndSimulate;
