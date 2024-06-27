import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';
import styles from './UploadPhotoPage.module.css'; // Import CSS module

const CameraCapture = ({ onCapture }) => {
    const [loading, setLoading] = useState(true);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            setLoading(false);
        };

        loadModels();
    }, []);

    const capture = async () => {
        if (webcamRef.current && canvasRef.current && webcamRef.current.video.readyState === 4) {
            const webcam = webcamRef.current.video;
            const width = webcam.videoWidth;
            const height = webcam.videoHeight;
            const displaySize = { width, height };

            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detections = await faceapi.detectAllFaces(webcam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Draw face detection boxes on canvas
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

            // If face detected, capture image
            if (resizedDetections.length > 0) {
                const imageSrc = webcamRef.current.getScreenshot();
                onCapture(imageSrc);
            }
        }
    };


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {loading ? (
                    <p>Loading models...</p>
                ) : (
                    <>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/png"
                            className={styles.webcam}
                        />
                        <canvas ref={canvasRef} className={styles.canvas}></canvas>
                        <button onClick={capture} className={styles.captureButton}>Chụp ảnh</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraCapture;
