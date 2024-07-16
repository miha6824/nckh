// TrainAndSimulate.js
import React from 'react';
import axios from 'axios';

const TrainAndSimulate = () => {
    const handleTrainAndSimulate = async () => {
        try {
            const response = await axios.post('http://localhost:8081/train_and_evaluate');
            alert(response.data.message);
        } catch (error) {
            console.error('Lỗi khi đang TrainandTest:', error);
            alert('Lỗi khi đang TrainandTest');
        }
    };

    return (
        <div>
            <button onClick={handleTrainAndSimulate}>Train and eveluate</button>
        </div>
    );
};

export default TrainAndSimulate;
