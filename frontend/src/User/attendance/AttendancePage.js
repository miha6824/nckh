import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import styles from './Atendance.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AttendancePage() {
    const videoHeight = 480;
    const videoWidth = 640;
    const [initializing, setInitializing] = useState(true);
    const videoRef = useRef();
    const canvasRef = useRef();


    const [userInfo, setUserInfo] = useState({
        email: '',
        fullName: '',
        dob: '',
        phoneNumber: '',
        address: '',
        gender: '',
        id_department: ''
    });


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
                setInitializing(false);
            };
        } catch (err) {
            console.error('Error accessing webcam:', err);
        }
    };

    const getUserDescriptors = async () => {
        const response = await fetch('http://localhost:8081/CRUD_ImgUser');
        const userData = await response.json();
        return userData.map(user => {
            return {
                userName: user.UserName,
                id_user: user.ID_User,
                faceDescriptor: JSON.parse(user.FaceDescriptor)
            };
        });
    };

    const handleVideoOnPlay = () => {
        getUserDescriptors()
            .then(userDescriptors => {
                const detectFace = async () => {
                    if (!videoRef.current) return;
                    const displaySize = { width: videoWidth, height: videoHeight };
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                    // So sánh đặc trưng với cơ sở dữ liệu
                    resizedDetections.forEach(async (detection) => {
                        const faceDescriptor = detection.descriptor;
                        const match = userDescriptors.find((user) => {
                            return (
                                faceapi.euclideanDistance(faceDescriptor, user.faceDescriptor) <
                                0.6
                            ); // Ngưỡng khoảng cách
                        });
                        if (match) {
                            console.log('Khuôn mặt thuộc về:', match.userName);

                            try {
                                const res = await axios.get(`http://localhost:8081/user/${match.id_user}`);
                                const preUserInfo = res.data;
                                console.log(preUserInfo);
                                setUserInfo({
                                    email: preUserInfo.Email,
                                    fullName: preUserInfo.FullName,
                                    dob: new Date(preUserInfo.BirthDay).toISOString().split('T')[0],
                                    phoneNumber: preUserInfo.Telephone,
                                    address: preUserInfo.Address,
                                    gender: preUserInfo.Sex,
                                    id_department: preUserInfo.ID_Department
                                });
                            } catch (error) {
                                console.error('Error fetching user info:', error);
                            }

                            const { x, y, width, height } = detection.detection.box;
                            const ctx = canvasRef.current.getContext('2d');
                            ctx.fillStyle = 'green';
                            ctx.font = '24px Arial';
                            ctx.fillText(
                                match.userName + '-' + match.id_user,
                                x + 5,
                                y + height + 24
                            );
                        } else {
                            console.log('Không nhận diện được người này');
                            // Vẽ nhãn "Unknown" trên khuôn mặt
                            setUserInfo({
                                email: 'unknow',
                                fullName: 'unknow',
                                dob: 'unknow',
                                phoneNumber: 'unknow',
                                address: 'unknow',
                                gender: 'unknow',
                                id_department: 'unknow'
                            });
                            const { x, y, width, height } = detection.detection.box;
                            const ctx = canvasRef.current.getContext('2d');
                            ctx.fillStyle = 'red';
                            ctx.font = '24px Arial';
                            ctx.fillText('Unknown', x + 5, y + height + 24);
                        }
                    });
                };

                setInterval(detectFace, 1000);
            })
            .catch(error => {
                console.error('Error getting user descriptors:', error);
            });
    };

    return (
        <div>
            <Link to='/login' className={`${styles.btn} btn btn-success rounded-0`}>Sign-In</Link>
            <div className={styles.App}>
                {initializing && <span>Initializing...</span>}
                <div className={styles.displayflex}>
                    <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                    <canvas ref={canvasRef} className={styles.positionabsolute} width={videoWidth} height={videoHeight} />
                </div>
                <div className={styles.userinfocontainer}>
                    <h2>User Info</h2>
                    <p>Email: {userInfo.email}</p>
                    <p>Full Name: {userInfo.fullName}</p>
                    <p>Date of Birth: {userInfo.dob}</p>
                    <p>Phone Number: {userInfo.phoneNumber}</p>
                    <p>Address: {userInfo.address}</p>
                    <p>Gender: {userInfo.gender}</p>
                    <p>ID_Department: {userInfo.id_department}</p>
                </div>
            </div>
        </div>

    );
}

export default AttendancePage;
