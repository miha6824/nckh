import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import UserNavbar from '../Navbar/UserNavbar';
import './Atendance.css';

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
            <UserNavbar />
            <div className='App'>

                {initializing && <span>Initializing...</span>}
                <div className='display-flex justify-content-center'>
                    <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                    <canvas ref={canvasRef} className='position-absolute' width={videoWidth} height={videoHeight} />
                </div>
            </div>
        </div>

    );
}

export default AttendancePage;
