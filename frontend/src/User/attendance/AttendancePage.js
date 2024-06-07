import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import styles from './Atendance.module.css';
import { Link } from 'react-router-dom';

function AttendancePage() {
    const videoHeight = 480;
    const videoWidth = 640;
    const [initializing, setInitializing] = useState(true); // Ban đầu đặt initializing là true
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ]);
                startVideo();
            } catch (error) {
                console.error('Error loading models:', error);
            }
        };
        loadModels();
    }, []);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                setInitializing(false); // Đã load video, đặt initializing là false
            };
        } catch (err) {
            console.error('Error accessing webcam:', err);
        }
    };

    const handleVideoOnPlay = () => {
        const detectFace = async () => {
            if (!videoRef.current) return;
            const displaySize = { width: videoWidth, height: videoHeight };
            faceapi.matchDimensions(canvasRef.current, displaySize);
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        };
        setInterval(detectFace, 1000); // Thực hiện detectFace mỗi giây
    };

    return (
        <div>
            <Link to='/login' className={`${styles.btn} btn btn-success rounded-0`}>Sign-In</Link>
            <div className={styles.App}>
                {initializing && <span>Initializing...</span>}
                <div className={`${styles.displayflex}`}>
                    <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                    <canvas ref={canvasRef} className={styles.positionabsolute} width={videoWidth} height={videoHeight} />
                </div>
            </div>
        </div>

    );
}

export default AttendancePage;
