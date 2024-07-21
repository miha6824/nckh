import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import styles from './Attendance.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AttendancePage() {
    const videoHeight = 480;
    const videoWidth = 640;
    const [initializing, setInitializing] = useState(true);
    const videoRef = useRef();
    const canvasRef = useRef();
    const ctxRef = useRef(null);

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

    useEffect(() => {
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d');
        }
    }, [canvasRef]);

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
        const response = await fetch('http://localhost:8081/CRUD_ImgUserforattendance');
        const userData = await response.json();
        return userData.map(user => {
            return {
                label: user.Label,
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
                    ctxRef.current.clearRect(0, 0, videoWidth, videoHeight);
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

                    resizedDetections.forEach(async (detection) => {
                        const faceDescriptor = detection.descriptor;
                        const match = userDescriptors.find((user) => {
                            return (
                                faceapi.euclideanDistance(faceDescriptor, user.faceDescriptor) < 0.6
                            );
                        });

                        if (match) {
                            console.log('Khuôn mặt thuộc về:', match.label);

                            // Chụp ảnh khi nhận diện thành công
                            const photoCanvas = document.createElement('canvas');
                            photoCanvas.width = videoWidth;
                            photoCanvas.height = videoHeight;
                            const photoCtx = photoCanvas.getContext('2d');
                            photoCtx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

                            // Chuyển đổi ảnh sang định dạng base64 để gửi lên server
                            const imageData = photoCanvas.toDataURL('image/jpeg');

                            // Gửi ảnh và thông tin về server để lưu vào bảng attendance
                            try {
                                const response = await axios.post('http://localhost:8081/attendance', {
                                    userId: match.id_user,
                                    imageBase64: imageData,
                                });
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
                                console.log('Attendance recorded successfully:', response.data);
                            } catch (error) {
                                console.error('Error saving attendance:', error);
                            }
                            const { x, y, width, height } = detection.detection.box;
                            ctxRef.current.fillStyle = 'green';
                            ctxRef.current.font = '24px Arial';
                            ctxRef.current.fillText(
                                match.label + '-' + match.id_user,
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
                            ctxRef.current.fillStyle = 'red';
                            ctxRef.current.font = '24px Arial';
                            ctxRef.current.fillText('Unknown', x + 5, y + height + 24);
                        }
                    });
                };

                setInterval(detectFace, 1000); // Thực hiện phát hiện khuôn mặt mỗi giây
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            });
    };

    return (
        <div className={styles.container}>
            <Link to='/login' className={`${styles.btn} btn btn-success rounded-0`}>Sign-In</Link>
            <div className={styles.app}>
                {initializing && <span className={styles.initializing}>Đang truy cập camera...</span>}
                <div className={styles.videoContainer}>
                    <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                    <canvas ref={canvasRef} className={styles.canvas} width={videoWidth} height={videoHeight} />
                </div>
                <div className={styles.userInfoContainer}>
                    <h2>User Info</h2>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Full Name:</strong> {userInfo.fullName}</p>
                    <p><strong>Date of Birth:</strong> {userInfo.dob}</p>
                    <p><strong>Phone Number:</strong> {userInfo.phoneNumber}</p>
                    <p><strong>Address:</strong> {userInfo.address}</p>
                    <p><strong>Gender:</strong> {userInfo.gender}</p>
                    <p><strong>ID_Department:</strong> {userInfo.id_department}</p>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;
