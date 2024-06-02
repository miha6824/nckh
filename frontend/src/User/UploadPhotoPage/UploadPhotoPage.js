import React, { useState } from 'react';
import axios from 'axios';

const UploadPhotoPage = ({ username, id_user }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        console.log("Uploading file:", selectedFile.name); // Thêm console.log để xác nhận tệp được chọn để tải lên
        console.log("Username:", username); // Kiểm tra tên người dùng đã được truyền từ props
        console.log("ID User:", id_user); // Kiểm tra ID người dùng đã được truyền từ props
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('username', username);
        formData.append('id_user', id_user);

        try {
            const response = await axios.post('/UserPostImg', formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                }
            });
            console.log(response.data);
            // Clear selected file and reset progress after successful upload
            setSelectedFile(null);
            setUploadProgress(0);
            alert('Upload successful!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Error uploading photo. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Upload Photo</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
        </div>
    );
};

export default UploadPhotoPage;
