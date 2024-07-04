const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require('multer');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const canvas = require('canvas');
const fs = require('fs');
const schedule = require('node-schedule');
const moment = require('moment');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "qlcc"
});


faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Hàm tải các mô hình của face-api.js
async function LoadModels() {
    const modelPath = path.join(__dirname, 'public', 'models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
}
LoadModels();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use('public/Images', express.static(path.join(__dirname, 'public/Images')));


app.get("/CRUD_User", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});


app.get("/CRUD_Department", (req, res) => {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

app.get('/DepartmentName/:id', (req, res) => {
    const sql = "SELECT TenPhongBan FROM department WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        if (data.length === 0) return res.status(404).json("Department not found");
        return res.status(200).json(data[0].TenPhongBan);
    });
});

app.post('/create_Department', (req, res) => {
    const sql = "INSERT INTO Department (KHPhongBan, TenPhongBan) VALUES ?";
    const values = [
        [
            req.body.khphongban,
            req.body.tenphongban,
        ]
    ];

    // Thực hiện truy vấn vào cơ sở dữ liệu
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thực hiện truy vấn:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi tạo tài khoản');
        }
        console.log('tài khoản đã được tạo thành công');
        return res.status(200).json('tài khoản đã được tạo thành công');
    });
});

app.get("/HSLuong", (req, res) => {
    const sql = "SELECT * FROM salary";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});


app.get("/CRUD_Account", (req, res) => {
    const sql = "SELECT * FROM account";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});


app.post('/create_account', (req, res) => {
    const sql = "INSERT INTO account (Email, Password, ID_User, Role) VALUES ?";
    const values = [
        [
            req.body.email,
            req.body.password,
            req.body.id_user,
            req.body.role,
        ]
    ];

    // Thực hiện truy vấn vào cơ sở dữ liệu
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thực hiện truy vấn:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi tạo tài khoản');
        }
        console.log('tài khoản đã được tạo thành công');
        return res.status(200).json('tài khoản đã được tạo thành công');
    });
});


app.delete('/Delete_account/:id', (req, res) => {
    const sql = "DELETE FROM account WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User delete successfully");
    });
});



app.get('/account/:id', (req, res) => {
    const id = req.params.id;
    console.log("Received account ID:", id); // Thêm console.log để kiểm tra ID người dùng nhận được

    const sql = "SELECT * FROM account WHERE ID = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi server");
        }
        console.log("Data from database:", data); // Thêm console.log để kiểm tra dữ liệu từ cơ sở dữ liệu

        if (data.length > 0) {
            return res.status(200).json(data[0]);
        } else {
            return res.status(404).json("Không tìm thấy người dùng");
        }
    });
});



app.put('/change_password/:id', (req, res) => {
    const userId = req.params.id;
    const { password } = req.body;

    // Update the password in the database (hash the password before saving it)
    const sql = 'UPDATE account SET Password = ? WHERE ID_User = ?';
    db.query(sql, [password, userId], (err, result) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi server");
        }
        return res.status(200).json("Đổi mật khẩu thành công");
    });
});








app.put('/update_account/:id', (req, res) => {
    const sql = "UPDATE account SET `Email`=?, `Password`=?, `ID_User`=?, `Role`=? WHERE ID=?";
    const values = [
        req.body.email,
        req.body.password,
        req.body.id_user,
        req.body.role,
    ]
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User update successfully");
    });
});



app.get("/CRUD_Attendance", (req, res) => {
    const sql = "SELECT * FROM attendance";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

app.delete('/Delete_atten/:id', (req, res) => {
    const sql = "DELETE FROM attendance WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User delete successfully");
    });
});



app.post('/create_user', (req, res) => {
    const sql = "INSERT INTO user (Email, FullName, Sex, BirthDay, Telephone, Address, ID_Department, HSLuong) VALUES ?";
    const values = [
        [
            req.body.email,
            req.body.fullName,
            req.body.sex,
            req.body.dob,
            req.body.phoneNumber,
            req.body.address,
            req.body.id_departments,
            req.body.hsl
        ]
    ];

    // Thực hiện truy vấn vào cơ sở dữ liệu
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thực hiện truy vấn:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi tạo người dùng');
        }
        console.log('Người dùng đã được tạo thành công');
        return res.status(200).json('Người dùng đã được tạo thành công');
    });
});

app.put('/update_user/:id', (req, res) => {
    const sql = "UPDATE user SET `Email`=?, `FullName`=?, `Sex`=?, `BirthDay`=?, `Telephone`=?, `Address`=?, `ID_Department`=?, `HSLuong`=? WHERE ID=?";
    const dobFormatted = moment(req.body.dob).format('YYYY-MM-DD'); // Định dạng ngày tháng bằng moment
    const values = [
        req.body.email,
        req.body.fullName,
        req.body.sex,
        dobFormatted, // Sử dụng ngày tháng đã định dạng
        req.body.phoneNumber,
        req.body.address,
        req.body.id_departments,
        req.body.hsl
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User update successfully");
    });
});

app.delete('/Delete_user/:id', (req, res) => {
    const id = req.params.id;
    const deleteAccountSql = "DELETE FROM account WHERE ID_User=?";
    const deleteUserSql = "DELETE FROM user WHERE ID=?";
    const deleteImgUserSql = "DELETE FROM userimage WHERE ID_User=?";
    const deleteAttendance = "DELETE FROM attendance WHERE ID_User=?";
    db.query(deleteAccountSql, [id], (err, data) => {
        if (err) {
            console.error(err); // Log lỗi
            return res.status(500).json("Error deleting related account records");
        }
        db.query(deleteImgUserSql, [id], (err, data) => {
            if (err) {
                console.error(err); // Log lỗi
                return res.status(500).json("Error deleting user");
            }
            db.query(deleteAttendance, [id], (err, data) => {
                if (err) {
                    console.error(err); // Log lỗi
                    return res.status(500).json("Error deleting user");
                }
                db.query(deleteUserSql, [id], (err, data) => {
                    if (err) {
                        console.error(err); // Log lỗi
                        return res.status(500).json("Error deleting user");
                    }
                    return res.status(200).json("User and related account records deleted successfully");
                });
            });
        });
    });
});


// lấy tất cả user kể cả không có ảnh
app.get("/CRUD_ImgUser", (req, res) => {
    const sql = `
        SELECT u.ID as UserID, u.FullName, ui.ID as ImageID, ui.Image
        FROM user u
        LEFT JOIN userimage ui ON u.ID = ui.ID_User
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

// Delete a user image
app.delete('/Delete_ImgUser/:id', (req, res) => {
    const sql = "SELECT Image FROM userimage WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).send({ error: "Error fetching image" });
        }

        if (result.length === 0) {
            console.error("Image not found");
            return res.status(404).send({ error: "Image not found" });
        }

        const imageName = result[0].Image;

        // Delete the image record from the database
        const deleteSql = "DELETE FROM userimage WHERE ID=?";
        db.query(deleteSql, [id], (err, data) => {
            if (err) {
                console.error("Error deleting image record:", err);
                return res.status(500).send({ error: "Error deleting image record" });
            }

            // Delete the image file from the file system
            const filePath = path.join(__dirname, 'public/Images', imageName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                    return res.status(500).send({ error: "Error deleting image file" });
                }
                res.status(200).json("Image deleted successfully");
            });
        });
    });
});




app.post('/ImgUserAdd/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    console.log("Received request to upload image for user ID:", id);

    if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Thực hiện truy vấn SQL để lấy thông tin về UserName và ID_User từ bảng `user`
    const userInfoQuery = "SELECT FullName as UserName, ID as ID_User FROM user WHERE ID = ?";
    db.query(userInfoQuery, [id], async (err, userInfo) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        if (userInfo.length === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const userName = userInfo[0].UserName;
        const userId = userInfo[0].ID_User;

        const sql = "INSERT INTO userimage (UserName, Image, ID_User, FaceDescriptor) VALUES ?";
        let progress = 0;
        try {
            console.log(`Progress: ${progress}% - Starting image processing...`);

            // Bắt đầu quá trình trích xuất đặc trưng khuôn mặt từ ảnh
            progress += 20;
            const imagePath = path.join(__dirname, 'public/Images', req.file.filename);
            console.log(`Progress: ${progress}% - Loading image...`);
            const img = await canvas.loadImage(imagePath);

            progress += 20;
            console.log(`Progress: ${progress}% - Detecting face and extracting features...`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (!detections) {
                console.log(`Progress: ${progress}% - No face detected`);
                return res.status(400).json({ error: "No face detected" });
            }

            progress += 20;
            console.log(`Progress: ${progress}% - Face detected, extracting descriptor...`);
            const descriptor = detections.descriptor;
            const descriptorArray = Array.from(descriptor);

            progress += 20;
            console.log(`Progress: ${progress}% - Converting descriptor to array...`);

            const values = [
                [
                    userName,
                    req.file.filename,
                    userId,
                    JSON.stringify(descriptorArray)
                ]
            ];

            progress += 20;
            console.log(`Progress: ${progress}% - Inserting data into database...`);
            db.query(sql, [values], (err, data) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json("Error");
                }
                console.log(`Progress: 100% - Data inserted successfully`);
                return res.status(200).json("Img created and face descriptor saved successfully");
            });
        } catch (error) {
            console.error("Face API error:", error);
            return res.status(500).json("Error processing image");
        }
    });
});



// Hàm xử lý tải lên ảnh và lưu thông tin vào cơ sở dữ liệu
app.post('/create_ImgUser', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const sql = "INSERT INTO userimage (UserName, Image, ID_User, FaceDescriptor) VALUES ?";
    let progress = 0;

    try {
        console.log(`Progress: ${progress}% - Starting image processing...`);

        // Bắt đầu quá trình trích xuất đặc trưng khuôn mặt từ ảnh
        progress += 20;
        const imagePath = path.join(__dirname, 'public/Images', req.file.filename);
        console.log(`Progress: ${progress}% - Loading image...`);
        const img = await canvas.loadImage(imagePath);

        progress += 20;
        console.log(`Progress: ${progress}% - Detecting face and extracting features...`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detections) {
            console.log(`Progress: ${progress}% - No face detected`);
            return res.status(400).json({ error: "No face detected" });
        }

        progress += 20;
        console.log(`Progress: ${progress}% - Face detected, extracting descriptor...`);
        const descriptor = detections.descriptor;
        const descriptorArray = Array.from(descriptor); // Chuyển đổi Float32Array thành mảng thường để lưu vào MySQL

        progress += 20;
        console.log(`Progress: ${progress}% - Converting descriptor to array...`);

        const values = [
            [
                req.body.username,
                req.file.filename,
                req.body.id_user,
                JSON.stringify(descriptorArray) // Lưu đặc trưng khuôn mặt vào cột FaceDescriptor
            ]
        ];

        progress += 20;
        console.log(`Progress: ${progress}% - Inserting data into database...`);
        db.query(sql, [values], (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json("Error");
            }
            console.log(`Progress: 100% - Data inserted successfully`);
            return res.status(200).json("Img created and face descriptor saved successfully");
        });
    } catch (error) {
        console.error("Face API error:", error);
        return res.status(500).json("Error processing image");
    }
});


// Thêm vào endpoint đăng nhập  
app.post('/login', (req, res) => {
    console.log("Received email:", req.body.email);
    const sql = "SELECT * FROM account WHERE Email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Lỗi server");
        }
        console.log("Data from database:", data);

        if (data.length > 0) {
            const account = data[0];
            const userID = account.ID_User;
            const userSql = "SELECT * FROM user WHERE ID = ?";
            db.query(userSql, [userID], (err, userData) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json("Lỗi server");
                }
                if (userData.length > 0) {
                    const token = jwt.sign({ userID: account.ID_User }, 'secret', { expiresIn: '1h' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.status(200).json({ message: "Đăng nhập thành công", userData: userData[0] });
                } else {
                    return res.status(404).json("Không tìm thấy thông tin người dùng");
                }
            });
        } else {
            return res.status(401).json("Email hoặc mật khẩu không hợp lệ");
        }
    });
});


app.get('/logout', (req, res) => {
    // Xóa cookie token để đăng xuất người dùng
    res.clearCookie('token');
    res.status(200).json("Đăng xuất thành công");
});


// Endpoint for user registration
app.post('/register', (req, res) => {
    const { email, password, fullName, sex, birthday, telephone, address } = req.body;
    const sqlCheck = "SELECT * FROM account WHERE Email = ?";
    const sqlInsertUser = "INSERT INTO user (Email, FullName, Sex, BirthDay, Telephone, Address) VALUES (?, ?, ?, ?, ?, ?)";
    const sqlInsertAccount = "INSERT INTO account (Email, Password, ID_User, Role) VALUES (?, ?, ?, ?)";

    // Check if email already exists
    db.query(sqlCheck, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }
        if (data.length > 0) {
            return res.status(409).json("Email already exists");
        } else {
            // Insert new user
            db.query(sqlInsertUser, [email, fullName, sex, birthday, telephone, address], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json("Error");
                }
                const userID = result.insertId;
                const role = "user"; // Set role to "user"
                // Insert new account
                db.query(sqlInsertAccount, [email, password, userID, role], (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json("Error");
                    }
                    return res.status(200).json("User registered successfully");
                });
            });
        }
    });
});



// API endpoint để lấy tất cả ảnh của người dùng dựa trên ID_User
app.get('/userImages/:userID', (req, res) => {
    const userID = req.params.userID;
    const sql = `SELECT * FROM userimage WHERE ID_User = ?`;
    db.query(sql, userID, (err, result) => {
        if (err) {
            console.error("Error retrieving user images:", err);
            res.status(500).json({ error: "Lỗi khi lấy danh sách ảnh của người dùng" });
        } else {
            res.json(result);
        }
    });
});






app.delete('/deleteUserImage/:userID/:imageID', (req, res) => {
    const userID = req.params.userID;
    const imageID = req.params.imageID;

    // First, get the image file name to delete the file
    const getImageSql = `SELECT Image FROM userimage WHERE ID_User = ? AND ID = ?`;
    db.query(getImageSql, [userID, imageID], (err, result) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).send({ error: "Error fetching image" });
        }

        if (result.length === 0) {
            console.error("Image not found");
            return res.status(404).send({ error: "Image not found" });
        }

        const imageName = result[0].Image;

        // Delete the image record from the database
        const deleteSql = `DELETE FROM userimage WHERE ID_User = ? AND ID = ?`;
        db.query(deleteSql, [userID, imageID], (err, result) => {
            if (err) {
                console.error("Error deleting image record:", err);
                return res.status(500).send({ error: "Error deleting image record" });
            }

            // Delete the image file from the file system
            const filePath = path.join(__dirname, 'public/Images', imageName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                    return res.status(500).send({ error: "Error deleting image file" });
                }
                res.send('Image deleted successfully');
            });
        });
    });
});








app.post('/ImgUserAddUserSite/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    console.log("Received request to upload image for user ID:", id);

    if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Thực hiện truy vấn SQL để lấy thông tin về UserName và ID_User
    const userInfoQuery = "SELECT UserName, ID_User FROM userimage WHERE ID = ?";
    db.query(userInfoQuery, [id], async (err, userInfo) => {
        const sql = "INSERT INTO userimage (UserName, Image, ID_User, FaceDescriptor) VALUES ?";
        let progress = 0;
        try {
            console.log(`Progress: ${progress}% - Starting image processing...`);

            // Bắt đầu quá trình trích xuất đặc trưng khuôn mặt từ ảnh
            progress += 20;
            const imagePath = path.join(__dirname, 'public/Images', req.file.filename);
            console.log(`Progress: ${progress}% - Loading image...`);
            const img = await canvas.loadImage(imagePath);

            progress += 20;
            console.log(`Progress: ${progress}% - Detecting face and extracting features...`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (!detections) {
                console.log(`Progress: ${progress}% - No face detected`);
                return res.status(400).json({ error: "No face detected" });
            }

            progress += 20;
            console.log(`Progress: ${progress}% - Face detected, extracting descriptor...`);
            const descriptor = detections.descriptor;
            const descriptorArray = Array.from(descriptor); // Chuyển đổi Float32Array thành mảng thường để lưu vào MySQL

            progress += 20;
            console.log(`Progress: ${progress}% - Converting descriptor to array...`);

            const values = [
                [
                    req.body.username,
                    req.file.filename,
                    req.body.id_user,
                    JSON.stringify(descriptorArray)
                ]
            ];

            progress += 20;
            console.log(`Progress: ${progress}% - Inserting data into database...`);
            db.query(sql, [values], (err, data) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json("Error");
                }
                console.log(`Progress: 100% - Data inserted successfully`);
                return res.status(200).json("Img created and face descriptor saved successfully");
            });
        } catch (error) {
            console.error("Face API error:", error);
            return res.status(500).json("Error processing image");
        }
    });
});



// Endpoint để lấy thông tin người dùng dựa trên ID
app.get('/userInfo4AddImg/:id', (req, res) => {
    const userId = req.params.id;

    const userInfoQuery = "SELECT FullName as UserName, ID as ID_User FROM user WHERE ID = ?";
    db.query(userInfoQuery, [userId], (err, userInfo) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        if (userInfo.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông tin người dùng
        res.json(userInfo[0]);
    });
});



// Endpoint để lấy thông tin người dùng dựa trên ID
app.get('/userInfo4AddImgUserSite/:id', (req, res) => {
    const userId = req.params.id;
    console.log("Received user ID:", userId);
    const userInfoQuery = "SELECT FullName, ID FROM user WHERE ID= ?";
    db.query(userInfoQuery, [userId], (err, userInfo) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }
        console.log("Data from database:", userInfo);
        if (userInfo.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Trả về thông tin người dùng
        res.json(userInfo[0]);
    });
});



app.get('/department/:id', (req, res) => {
    const id = req.params.id;
    console.log("Received user ID:", id); // Thêm console.log để kiểm tra ID người dùng nhận được

    const sql = "SELECT * FROM departments WHERE ID = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi server");
        }
        console.log("Data from database:", data); // Thêm console.log để kiểm tra dữ liệu từ cơ sở dữ liệu

        if (data.length > 0) {
            return res.status(200).json(data[0]);
        } else {
            return res.status(404).json("Không tìm thấy người dùng");
        }
    });
});




// Endpoint để lấy dữ liệu người dùng dựa trên ID
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    console.log("Received user ID:", id);

    const sql = "SELECT * FROM user WHERE ID = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi server");
        }

        console.log("Data from database:", data);

        if (data.length > 0) {
            // Định dạng lại ngày tháng trước khi gửi dữ liệu về cho client
            const user = data[0];
            user.BirthDay = moment(user.BirthDay).format('YYYY-MM-DD'); // Định dạng lại ngày tháng

            return res.status(200).json(user);
        } else {
            return res.status(404).json("Không tìm thấy người dùng");
        }
    });
});


app.put('/update_profile/:id', (req, res) => {
    const sql = "UPDATE user SET `Email`=?, `FullName`=?, `Sex`=?, `BirthDay`=?, `Telephone`=?, `Address`=? WHERE ID=?";
    const values = [
        req.body.email,
        req.body.fullName,
        req.body.gender,
        req.body.dob,
        req.body.phoneNumber,
        req.body.address
    ];
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error("Lỗi cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi");
        }
        return res.status(200).json("Cập nhật thông tin thành công");
    });
});


// Endpoint để thiết lập giờ check-in và check-out tiêu chuẩn
app.post('/setStandardTimes', (req, res) => {
    const { date, checkinTime, checkoutTime } = req.body;

    // Kiểm tra đầu vào
    if (!date || !checkinTime || !checkoutTime) {
        return res.status(400).json({ message: "Yêu cầu cung cấp đầy đủ thông tin: date, checkinTime, checkoutTime" });
    }

    // Định dạng thời gian
    const formattedCheckinTime = checkinTime.length === 5 ? `${checkinTime}:00` : checkinTime;
    const formattedCheckoutTime = checkoutTime.length === 5 ? `${checkoutTime}:00` : checkoutTime;

    const insertOrUpdateStandardTimesSql = `
        INSERT INTO standard_times (date, checkin_time, checkout_time)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            checkin_time = VALUES(checkin_time),
            checkout_time = VALUES(checkout_time)
    `;

    db.query(insertOrUpdateStandardTimesSql, [date, formattedCheckinTime, formattedCheckoutTime], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Lỗi khi lưu giờ tiêu chuẩn" });
        }

        return res.status(200).json({ message: "Thiết lập giờ tiêu chuẩn thành công" });
    });
});



// Endpoint để ghi nhận điểm danh
app.post('/attendance', (req, res) => {
    const { userId, fullName, imageBase64 } = req.body;
    const lateCheckInThreshold = 5; // Điều chỉnh ngưỡng này tùy theo quy định của tổ chức
    const overTimeThreshold = 30; // Số phút cho phép tăng ca

    const checkLastAttendanceSql = "SELECT timestamp FROM attendance WHERE ID_User = ? ORDER BY timestamp DESC LIMIT 1";
    db.query(checkLastAttendanceSql, [userId], (err, result) => {
        if (err) {
            console.error("Lỗi cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi");
        }

        const currentTime = moment();
        const currentDate = currentTime.format('YYYY-MM-DD');
        const currentMinutes = currentTime.hours() * 60 + currentTime.minutes();

        const getStandardTimesSql = "SELECT TIME_TO_SEC(checkin_time) / 60 AS checkin_time, TIME_TO_SEC(checkout_time) / 60 AS checkout_time FROM standard_times WHERE date = ?";
        db.query(getStandardTimesSql, [currentDate], (err, standardTimesResult) => {
            if (err) {
                console.error("Lỗi cơ sở dữ liệu:", err);
                return res.status(500).json("Lỗi");
            }

            let standardCheckInTime, standardCheckOutTime;
            if (standardTimesResult.length === 0) {
                // Nếu không tìm thấy giờ tiêu chuẩn cho ngày hiện tại, thiết lập giá trị mặc định
                standardCheckInTime = 8 * 60; // 08:00 sáng
                standardCheckOutTime = 17 * 60; // 05:00 chiều
                console.warn("Không tìm thấy giờ tiêu chuẩn cho ngày hiện tại, sử dụng giá trị mặc định");
            } else {
                // Dùng giá trị từ cơ sở dữ liệu
                standardCheckInTime = standardTimesResult[0].checkin_time;
                standardCheckOutTime = standardTimesResult[0].checkout_time;
            }

            handleAttendance(userId, fullName, imageBase64, result, currentTime, currentMinutes, standardCheckInTime, standardCheckOutTime, lateCheckInThreshold, overTimeThreshold, res);
        });
    });
});

function handleAttendance(userId, fullName, imageBase64, lastAttendanceResult, currentTime, currentMinutes, standardCheckInTime, standardCheckOutTime, lateCheckInThreshold, overTimeThreshold, res) {
    let lateMinutes = 0;
    let earlyLeaveMinutes = 0;
    let overtimeMinutes = 0;

    if (lastAttendanceResult.length > 0) {
        const lastAttendanceTime = moment(lastAttendanceResult[0].timestamp);
        const lastAttendanceDate = lastAttendanceTime.format('YYYY-MM-DD');
        const timeDifference = currentTime.diff(lastAttendanceTime, 'minutes'); // Đổi sang phút

        if (timeDifference < 1) {
            return res.status(200).json("Đã ghi nhận điểm danh trong vòng 1 phút qua");
        }

        if (currentTime.format('YYYY-MM-DD') === lastAttendanceDate) {
            let Status = "check out";
            if (currentMinutes < standardCheckOutTime) {
                Status += ` sớm ${standardCheckOutTime - currentMinutes} phút`;
                earlyLeaveMinutes = standardCheckOutTime - currentMinutes;
            } else if (currentMinutes >= standardCheckOutTime + overTimeThreshold) {
                Status += ` tăng ca ${currentMinutes - standardCheckOutTime} phút`;
                overtimeMinutes = currentMinutes - standardCheckOutTime;
            }

            // Thực hiện insert vào bảng attendance với tình trạng đã xác định
            const insertAttendanceSql = "INSERT INTO attendance (ID_User, FullName, Image, Status, EarlyLeaveMinutes, OvertimeMinutes) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertAttendanceSql, [userId, fullName, imageBase64, Status, earlyLeaveMinutes, overtimeMinutes], (err, result) => {
                if (err) {
                    console.error("Lỗi khi thêm bản ghi điểm danh:", err);
                    return res.status(500).json("Lỗi khi lưu điểm danh");
                }
                return res.status(200).json("Điểm danh thành công");
            });

        } else {
            let Status = "check in";
            if (currentMinutes < standardCheckInTime - lateCheckInThreshold) {
                Status += ` sớm ${standardCheckInTime - currentMinutes} phút`;
            } else if (currentMinutes > standardCheckInTime + lateCheckInThreshold) {
                Status += ` muộn ${currentMinutes - standardCheckInTime} phút`;
                lateMinutes = currentMinutes - standardCheckInTime;
            }

            // Thực hiện insert vào bảng attendance với tình trạng đã xác định
            const insertAttendanceSql = "INSERT INTO attendance (ID_User, FullName, Image, Status, LateMinutes) VALUES (?, ?, ?, ?, ?)";
            db.query(insertAttendanceSql, [userId, fullName, imageBase64, Status, lateMinutes], (err, result) => {
                if (err) {
                    console.error("Lỗi khi thêm bản ghi điểm danh:", err);
                    return res.status(500).json("Lỗi khi lưu điểm danh");
                }
                return res.status(200).json("Điểm danh thành công");
            });
        }
    } else {
        let Status = "check in";
        if (currentMinutes < standardCheckInTime - lateCheckInThreshold) {
            Status += ` sớm ${standardCheckInTime - currentMinutes} phút`;
        } else if (currentMinutes > standardCheckInTime + lateCheckInThreshold) {
            Status += ` muộn ${currentMinutes - standardCheckInTime} phút`;
            lateMinutes = currentMinutes - standardCheckInTime;
        }

        // Thực hiện insert vào bảng attendance với tình trạng đã xác định
        const insertAttendanceSql = "INSERT INTO attendance (ID_User, FullName, Image, Status, LateMinutes) VALUES (?, ?, ?, ?, ?)";
        db.query(insertAttendanceSql, [userId, fullName, imageBase64, Status, lateMinutes], (err, result) => {
            if (err) {
                console.error("Lỗi khi thêm bản ghi điểm danh:", err);
                return res.status(500).json("Lỗi khi lưu điểm danh");
            }
            return res.status(200).json("Điểm danh thành công");
        });
    }
}








// Chạy vào lúc 23:59 mỗi ngày
const job = schedule.scheduleJob('59 23 * * *', () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const getUsersSql = "SELECT ID,FullName FROM user";
    db.query(getUsersSql, (err, users) => {
        if (err) {
            console.error("Database error:", err);
            return;
        }

        users.forEach(user => {
            const checkAttendanceSql = "SELECT * FROM attendance WHERE ID_User = ? AND DATE(timestamp) = ?";
            db.query(checkAttendanceSql, [user.ID, currentDate], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return;
                }

                if (result.length === 0) {
                    const insertAbsenceSql = "INSERT INTO attendance (ID_User, FullName, Image, Status) VALUES (?, ?, ?, ?)";
                    const fullName = user.FullName || "Unknown";
                    const imageBase64 = "nghỉ làm";
                    const status = "nghỉ làm";

                    db.query(insertAbsenceSql, [user.ID, fullName, imageBase64, status], (err, result) => {
                        if (err) {
                            console.error("Lỗi khi thêm bản ghi nghỉ làm:", err);
                            return;
                        }
                        console.log(`Ghi nhận nghỉ làm cho user ${user.ID_User}`);
                    });
                }
            });
        });
    });
});





app.get('/employees/:departmentId', (req, res) => {
    const departmentId = req.params.departmentId;
    db.query('SELECT * FROM user WHERE ID_Department = ?', [departmentId], (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            res.status(500).send('Error fetching employees');
        } else {
            res.status(200).json(results);
        }
    });
});


app.post('/generate-report', (req, res) => {
    const { department, employee, startDate, endDate } = req.body;

    const query = `
        SELECT a.ID_User, u.FullName, DATE(a.timestamp) AS Date,
               MIN(CASE WHEN a.Status LIKE 'check in%' THEN TIME(a.timestamp) END) AS CheckIn,
               MAX(CASE WHEN a.Status LIKE 'check out%' THEN TIME(a.timestamp) END) AS CheckOut,
               SUM(a.LateMinutes) AS LateMinutes,
               SUM(a.EarlyLeaveMinutes) AS EarlyLeaveMinutes,
               SUM(a.OvertimeMinutes) AS OvertimeMinutes
        FROM attendance a
        JOIN user u ON a.ID_User = u.ID
        WHERE u.ID_Department = ? AND u.ID = ? AND DATE(a.timestamp) BETWEEN ? AND ?
        GROUP BY a.ID_User, u.FullName, Date(a.timestamp)
    `;

    db.query(query, [department, employee, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error generating report:', err);
            return res.status(500).json('Error generating report');
        }

        // Xử lý thời gian trước khi gửi về client
        const formattedResults = results.map(result => ({
            ...result,
            Date: moment(result.Date).format('YYYY-MM-DD'),
            CheckIn: result.CheckIn ? moment(result.CheckIn, 'HH:mm:ss').format('HH:mm:ss') : null,
            CheckOut: result.CheckOut ? moment(result.CheckOut, 'HH:mm:ss').format('HH:mm:ss') : null,
            LateMinutes: result.LateMinutes > 0 ? result.LateMinutes : 0,
            EarlyLeaveMinutes: result.EarlyLeaveMinutes > 0 ? result.EarlyLeaveMinutes : 0,
            OvertimeMinutes: result.OvertimeMinutes > 0 ? result.OvertimeMinutes : 0
        }));

        res.status(200).json(formattedResults);
    });
});

const excel = require('exceljs');
app.post('/export-to-excel', async (req, res) => {
    const { employee, startDate, endDate } = req.body;

    try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Define columns
        worksheet.columns = [
            { header: 'Họ và tên', key: 'FullName', width: 20 },
            { header: 'Ngày', key: 'Date', width: 15 },
            { header: 'Check-in', key: 'CheckIn', width: 15 },
            { header: 'Check-out', key: 'CheckOut', width: 15 },
            { header: 'Trễ (phút)', key: 'LateMinutes', width: 15 },
            { header: 'Về sớm (Phút)', key: 'EarlyLeaveMinutes', width: 20 },
            { header: 'Tăng ca (Phút)', key: 'OvertimeMinutes', width: 20 }
        ];

        // Fetch data from database
        const query = `
            SELECT u.FullName, DATE(a.timestamp) AS Date,
                   MIN(CASE WHEN a.Status LIKE 'check in%' THEN TIME(a.timestamp) END) AS CheckIn,
                   MAX(CASE WHEN a.Status LIKE 'check out%' THEN TIME(a.timestamp) END) AS CheckOut,
                   SUM(a.LateMinutes) AS LateMinutes,
                   SUM(a.EarlyLeaveMinutes) AS EarlyLeaveMinutes,
                   SUM(a.OvertimeMinutes) AS OvertimeMinutes
            FROM attendance a
            JOIN user u ON a.ID_User = u.ID
            WHERE u.ID = ? AND DATE(a.timestamp) BETWEEN ? AND ?
            GROUP BY u.FullName, DATE(a.timestamp)
        `;

        const results = await new Promise((resolve, reject) => {
            db.query(query, [employee, startDate, endDate], (err, results) => {
                if (err) {
                    console.error('Error fetching report data:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Format data for Excel
        const formattedResults = results.map(result => ({
            FullName: result.FullName,
            Date: moment(result.Date).format('YYYY-MM-DD'),
            CheckIn: result.CheckIn ? moment(result.CheckIn, 'HH:mm:ss').format('HH:mm:ss') : null,
            CheckOut: result.CheckOut ? moment(result.CheckOut, 'HH:mm:ss').format('HH:mm:ss') : null,
            LateMinutes: result.LateMinutes > 0 ? result.LateMinutes : 0,
            EarlyLeaveMinutes: result.EarlyLeaveMinutes > 0 ? result.EarlyLeaveMinutes : 0,
            OvertimeMinutes: result.OvertimeMinutes > 0 ? result.OvertimeMinutes : 0
        }));

        // Add rows to worksheet
        worksheet.addRows(formattedResults);

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${employee}-${startDate}-to-${endDate}.xlsx`);

        // Send workbook as response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).send('Error exporting to Excel');
    }
});





// Endpoint để lấy dữ liệu chấm công của người dùng trong vòng 1 tháng
// Endpoint để lấy dữ liệu chấm công của người dùng trong vòng 1 tháng
app.get('/attendance/:id', (req, res) => {
    const id = req.params.id;
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');

    const sql = `
        SELECT a.ID_User, u.FullName, DATE(a.timestamp) AS Date,
               MIN(CASE WHEN a.Status LIKE 'check in%' THEN TIME(a.timestamp) END) AS CheckIn,
               MAX(CASE WHEN a.Status LIKE 'check out%' THEN TIME(a.timestamp) END) AS CheckOut,
               SUM(a.LateMinutes) AS LateMinutes,
               SUM(a.EarlyLeaveMinutes) AS EarlyLeaveMinutes,
               SUM(a.OvertimeMinutes) AS OvertimeMinutes
        FROM attendance a
        JOIN user u ON a.ID_User = u.ID
        WHERE a.ID_User = ? AND DATE(a.timestamp) BETWEEN ? AND ?
        GROUP BY a.ID_User, u.FullName, DATE(a.timestamp)
    `;

    db.query(sql, [id, startDate, endDate], (err, data) => {
        if (err) {
            console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi server");
        }

        if (data.length === 0) {
            return res.status(404).json("Không tìm thấy dữ liệu chấm công cho người dùng trong tháng này.");
        }

        const formattedData = data.map(record => {
            return {
                ...record,
                Date: moment(record.Date).format('YYYY-MM-DD'),
                CheckIn: record.CheckIn ? moment(record.CheckIn, 'HH:mm:ss').format('HH:mm:ss') : null,
                CheckOut: record.CheckOut ? moment(record.CheckOut, 'HH:mm:ss').format('HH:mm:ss') : null,
            };
        });

        return res.status(200).json(formattedData);
    });
});













// //mô hình mô phỏng nhận diện qua tập test 
// const { promisify } = require('util');
// const readdir = promisify(fs.readdir);
// const readFile = promisify(fs.readFile);

// const ORIGINAL_IMAGES_DIR = path.join(__dirname, 'Original Images');

// async function prepareData() {
//     const folders = await readdir(ORIGINAL_IMAGES_DIR);
//     for (const folder of folders) {
//         const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);
//         const files = await readdir(folderPath);
//         const totalFiles = files.length;
//         const trainSize = Math.floor(totalFiles * 0.7);
//         const testSize = totalFiles - trainSize;

//         // Tạo tài khoản email và mật khẩu dựa trên tên folder
//         const email = `${folder}@gmail.com`;
//         const password = '12345';
//         const fullName = folder;
//         const role = 'user';

//         // Lưu tài khoản vào database
//         const sqlCreateUser = `INSERT INTO user (FullName) VALUES (?)`;
//         db.query(sqlCreateUser, [fullName], (err, result) => {
//             if (err) throw err;
//             const userID = result.insertId;
//             const sqlCreateAccount = `INSERT INTO account (Email, Password, ID_User, Role) VALUES (?, ?, ?, ?)`;
//             db.query(sqlCreateAccount, [email, password, userID, role], (err, result) => {
//                 if (err) throw err;
//                 console.log(`Created account for ${fullName}`);
//             });
//         });

//         // Chia ảnh thành tập train và test
//         const trainFiles = files.slice(0, trainSize);
//         const testFiles = files.slice(trainSize);

//         // Lưu tập train và test vào folder riêng
//         const trainDir = path.join(folderPath, 'train');
//         const testDir = path.join(folderPath, 'test');
//         if (!fs.existsSync(trainDir)) fs.mkdirSync(trainDir);
//         if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

//         for (const file of trainFiles) {
//             fs.renameSync(path.join(folderPath, file), path.join(trainDir, file));
//         }
//         for (const file of testFiles) {
//             fs.renameSync(path.join(folderPath, file), path.join(testDir, file));
//         }
//     }
//     console.log("prepareData completed");
// }

// async function trainModel(folderPath) {
//     const trainDir = path.join(folderPath, 'train');
//     const files = await readdir(trainDir);
//     console.log(`Training model for ${path.basename(folderPath)} with ${files.length} files`);

//     const labeledDescriptors = [];
//     let processedCount = 0;

//     for (const file of files) {
//         try {
//             const imgPath = path.join(trainDir, file);
//             const img = await canvas.loadImage(imgPath);
//             const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//             if (!detection) continue;

//             const label = path.basename(folderPath);
//             labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]));

//             processedCount++;
//             const progress = (processedCount / files.length) * 100;
//             console.log(`Progress for ${path.basename(folderPath)}: ${progress.toFixed(2)}%`);
//         } catch (error) {
//             console.error(`Error processing file ${file} in ${folderPath}:`, error);
//         }
//     }

//     return labeledDescriptors;
// }



// async function evaluateModel(folderPath, labeledDescriptors) {
//     const testDir = path.join(folderPath, 'test');
//     const files = await readdir(testDir);
//     console.log(`Evaluating model for ${path.basename(folderPath)} with ${files.length} files`);

//     let correct = 0;
//     let processedCount = 0;

//     for (const file of files) {
//         try {
//             const imgPath = path.join(testDir, file);
//             const img = await canvas.loadImage(imgPath);
//             const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//             if (!detection) continue;

//             const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
//             const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

//             if (bestMatch.label === path.basename(folderPath)) {
//                 correct++;
//             }

//             processedCount++;
//             const progress = (processedCount / files.length) * 100;
//             console.log(`Progress for ${path.basename(folderPath)}: ${progress.toFixed(2)}%`);
//         } catch (error) {
//             console.error(`Error processing file ${file} in ${folderPath}:`, error);
//         }
//     }

//     console.log(`Accuracy for ${path.basename(folderPath)}: ${(correct / files.length) * 100}%`);
// }
// async function main() {
//     try {
//         await LoadModels();

//         const folders = await readdir(ORIGINAL_IMAGES_DIR);
//         for (const folder of folders) {
//             const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);
//             const labeledDescriptors = await trainModel(folderPath);
//             await evaluateModel(folderPath, labeledDescriptors);
//         }
//     } catch (error) {
//         console.error("Error in main function:", error);
//     }
// }

// app.post('/train_and_evaluate', async (req, res) => {
//     try {
//         await prepareData();
//         await main();
//         res.status(200).json({ message: "Training and evaluation completed" });
//     } catch (err) {
//         console.error("Error during training and evaluation:", err);
//         res.status(500).json({ error: "Error during training and evaluation" });
//     }
// });



const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const ORIGINAL_IMAGES_DIR = path.join(__dirname, 'Original Images');

async function prepareData() {
    const folders = await readdir(ORIGINAL_IMAGES_DIR);
    for (const folder of folders) {
        const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);
        const files = await readdir(folderPath);
        const totalFiles = files.length;
        const trainSize = Math.floor(totalFiles * 0.7);
        const testSize = totalFiles - trainSize;

        const email = `${folder}@gmail.com`;
        const password = '12345';
        const fullName = folder;
        const role = 'user';
        const address = 'Hà Nội'

        const sqlCreateUser = `INSERT INTO user (Email,FullName,Address) VALUES (?,?,?)`;
        db.query(sqlCreateUser, [email, fullName, address], (err, result) => {
            if (err) throw err;
            const userID = result.insertId;
            const sqlCreateAccount = `INSERT INTO account (Email, Password, ID_User, Role) VALUES (?, ?, ?, ?)`;
            db.query(sqlCreateAccount, [email, password, userID, role], (err, result) => {
                if (err) throw err;
                console.log(`Created account for ${fullName}`);
            });
        });

        const trainFiles = files.slice(0, trainSize);
        const testFiles = files.slice(trainSize);

        const trainDir = path.join(folderPath, 'train');
        const testDir = path.join(folderPath, 'test');
        if (!fs.existsSync(trainDir)) fs.mkdirSync(trainDir);
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        for (const file of trainFiles) {
            fs.renameSync(path.join(folderPath, file), path.join(trainDir, file));
        }
        for (const file of testFiles) {
            fs.renameSync(path.join(folderPath, file), path.join(testDir, file));
        }
    }
    console.log("prepareData completed");
}

// Hàm trainModel để huấn luyện mô hình và lưu trữ mô tả khuôn mặt và ảnh
async function trainModel(folderPath, userID) {
    const trainDir = path.join(folderPath, 'train');
    const files = await readdir(trainDir);
    console.log(`Training model for ${path.basename(folderPath)} with ${files.length} files`);

    const labeledDescriptors = [];
    let processedCount = 0;

    for (const file of files) {
        try {
            const imgPath = path.join(trainDir, file);
            const img = await canvas.loadImage(imgPath);
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (!detection) continue;

            const label = path.basename(folderPath);
            labeledDescriptors.push({
                label,
                descriptor: detection.descriptor
            });

            // Save image to public/Images folder with timestamp filename
            const targetFileName = `${Date.now()}${path.extname(file)}`;
            const targetPath = path.join('public', 'Images', targetFileName);
            fs.copyFileSync(imgPath, targetPath);

            processedCount++;
            const progress = (processedCount / files.length) * 100;
            console.log(`Progress for ${path.basename(folderPath)}: ${progress.toFixed(2)}%`);

            // Convert Float32Array descriptor to JSON string for storage
            const faceDescriptorFloat32 = Array.from(detection.descriptor); // Convert Float32Array to regular array
            const faceDescriptorJSON = JSON.stringify(faceDescriptorFloat32);

            // Save face descriptor to database
            const sqlInsert = `INSERT INTO userimage (UserName, Image, ID_User, FaceDescriptor) VALUES (?, ?, ?, ?)`;
            db.query(sqlInsert, [label, targetFileName, userID, faceDescriptorJSON], (err, result) => {
                if (err) throw err;
                console.log(`Saved face descriptor for ${label}`);
            });

        } catch (error) {
            console.error(`Error processing file ${file} in ${folderPath}:`, error);
        }
    }

    return labeledDescriptors;
}


async function simulateAttendance(folderPath, userID) {
    const testDir = path.join(folderPath, 'test');
    const testFiles = await readdir(testDir);

    const startDate = new Date('2024-07-01');
    const endDate = new Date('2024-07-31');
    const standardCheckInTime = 8; // 8 AM
    const standardCheckOutTime = 17; // 5 PM
    const maxLateCheckInMinutes = 30; // Số phút tối đa check-in muộn
    const maxEarlyCheckOutMinutes = 120; // Số phút tối đa check-out sớm

    // Định nghĩa sqlQuery ở đây để sử dụng trong các hàm con
    const sqlQuery = `SELECT * FROM userimage WHERE ID_User = ?`;

    // Hàm để tạo một tập hợp các ngày ngẫu nhiên tăng dần
    function getRandomDates(startDate, endDate, count) {
        const dates = [];
        const date = new Date(startDate);
        while (dates.length < count) {
            date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1); // Tăng ngày lên ngẫu nhiên từ 1 đến 3 ngày
            if (date > endDate) break;
            dates.push(new Date(date));
        }
        return dates;
    }

    // Lấy 5 ngày ngẫu nhiên duy nhất trong tháng 7
    const randomDates = getRandomDates(startDate, endDate, 5);

    // Xử lý mỗi ngày ngẫu nhiên
    for (const currentDate of randomDates) {
        try {
            // Chọn ngẫu nhiên thời gian check-in và check-out trong phạm vi cho phép
            const checkInTime = new Date(currentDate);
            checkInTime.setHours(standardCheckInTime, 0, 0, 0);
            checkInTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * maxLateCheckInMinutes));

            const checkOutTime = new Date(currentDate);
            checkOutTime.setHours(standardCheckOutTime, 0, 0, 0);
            checkOutTime.setMinutes(checkOutTime.getMinutes() - Math.floor(Math.random() * maxEarlyCheckOutMinutes));

            // Tính toán số phút đi trễ, về sớm và tăng ca
            let lateMinutes = Math.max(0, checkInTime.getHours() * 60 + checkInTime.getMinutes() - (standardCheckInTime * 60));
            let earlyLeaveMinutes = Math.max(0, (standardCheckOutTime * 60) - (checkOutTime.getHours() * 60 + checkOutTime.getMinutes()));
            let overtimeMinutes = 0;

            // Nếu có về sớm thì không có tăng ca và ngược lại
            if (earlyLeaveMinutes > 0) {
                overtimeMinutes = 0;
            } else {
                overtimeMinutes = Math.max(0, (checkOutTime.getHours() * 60 + checkOutTime.getMinutes()) - (standardCheckOutTime * 60));
                earlyLeaveMinutes = 0;
            }

            console.log(`Processing date: ${currentDate.toLocaleDateString()}`);
            console.log(`Check-in time: ${checkInTime}`);
            console.log(`Check-out time: ${checkOutTime}`);

            // Chọn ngẫu nhiên 1 ảnh trong thư mục test cho check-in và 1 ảnh khác cho check-out
            const randomFiles = [];
            while (randomFiles.length < 2) {
                const randomFile = testFiles[Math.floor(Math.random() * testFiles.length)];
                if (!randomFiles.includes(randomFile)) {
                    randomFiles.push(randomFile);
                }
            }

            // Load và xử lý ảnh cho check-in
            const checkInImgPath = path.join(testDir, randomFiles[0]);
            const checkInImg = await canvas.loadImage(checkInImgPath);
            const checkInDetection = await faceapi.detectSingleFace(checkInImg).withFaceLandmarks().withFaceDescriptor();

            if (checkInDetection) {
                const checkInDescriptor = Array.from(checkInDetection.descriptor); // Chuyển đổi Float32Array thành mảng thông thường
                const checkInDescriptorJSON = JSON.stringify(checkInDescriptor);

                // Đọc tệp ảnh và chuyển đổi thành base64
                const checkInImageBuffer = await readFile(checkInImgPath);
                const checkInImageBase64 = `data:image/jpeg;base64,${checkInImageBuffer.toString('base64')}`;

                // Truy vấn bảng userimage để tìm một bản khớp với face descriptor hiện tại
                const checkInResults = await new Promise((resolve, reject) => {
                    db.query(sqlQuery, [userID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });

                let checkInFound = false;
                for (const result of checkInResults) {
                    const savedDescriptor = JSON.parse(result.FaceDescriptor);

                    // So sánh face descriptor đã lưu với face descriptor hiện tại
                    const distance = faceapi.euclideanDistance(savedDescriptor, checkInDescriptor);
                    if (distance < 0.6) { // Điều chỉnh ngưỡng khoảng cách khi cần
                        // Chèn bản ghi check-in vào bảng attendance
                        const sqlInsertAttendance = `
                            INSERT INTO attendance (ID_User, FullName, timestamp, Status, Image, LateMinutes, EarlyLeaveMinutes, OvertimeMinutes) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        await new Promise((resolve, reject) => {
                            db.query(sqlInsertAttendance, [userID, result.UserName, checkInTime, 'Check in', checkInImageBase64, lateMinutes, 0, 0], (err) => {
                                if (err) return reject(err);
                                console.log(`Check-in recorded for user ${userID} on ${checkInTime}`);
                                resolve();
                            });
                        });
                        checkInFound = true;
                        break;
                    }
                }

                if (!checkInFound) {
                    console.log(`No matching face descriptor found for check-in on ${checkInImgPath}`);
                }
            } else {
                console.log(`No face detected in check-in image ${checkInImgPath}`);
            }

            // Load và xử lý ảnh cho check-out
            const checkOutImgPath = path.join(testDir, randomFiles[1]);
            const checkOutImg = await canvas.loadImage(checkOutImgPath);
            const checkOutDetection = await faceapi.detectSingleFace(checkOutImg).withFaceLandmarks().withFaceDescriptor();

            if (checkOutDetection) {
                const checkOutDescriptor = Array.from(checkOutDetection.descriptor); // Chuyển đổi Float32Array thành mảng thông thường
                const checkOutDescriptorJSON = JSON.stringify(checkOutDescriptor);

                // Đọc tệp ảnh và chuyển đổi thành base64
                const checkOutImageBuffer = await readFile(checkOutImgPath);
                const checkOutImageBase64 = `data:image/jpeg;base64,${checkOutImageBuffer.toString('base64')}`;

                // Truy vấn bảng userimage để tìm một bản khớp với face descriptor hiện tại
                const checkOutResults = await new Promise((resolve, reject) => {
                    db.query(sqlQuery, [userID], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });

                let checkOutFound = false;
                for (const result of checkOutResults) {
                    const savedDescriptor = JSON.parse(result.FaceDescriptor);

                    // So sánh face descriptor đã lưu với face descriptor hiện tại
                    const distance = faceapi.euclideanDistance(savedDescriptor, checkOutDescriptor);
                    if (distance < 0.6) { // Điều chỉnh ngưỡng khoảng cách khi cần
                        // Chèn bản ghi check-out vào bảng attendance
                        const sqlInsertAttendance = `
                            INSERT INTO attendance (ID_User, FullName, timestamp, Status, Image, LateMinutes, EarlyLeaveMinutes, OvertimeMinutes) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        await new Promise((resolve, reject) => {
                            db.query(sqlInsertAttendance, [userID, result.UserName, checkOutTime, 'Check out', checkOutImageBase64, 0, earlyLeaveMinutes, overtimeMinutes], (err) => {
                                if (err) return reject(err);
                                console.log(`Check-out recorded for user ${userID} on ${checkOutTime}`);
                                resolve();
                            });
                        });
                        checkOutFound = true;
                        break;
                    }
                }

                if (!checkOutFound) {
                    console.log(`No matching face descriptor found for check-out on ${checkOutImgPath}`);
                }
            } else {
                console.log(`No face detected in check-out image ${checkOutImgPath}`);
            }
        } catch (error) {
            console.error(`Error processing files for ${currentDate.toLocaleDateString()}:`, error);
        }
    }
}









async function main() {
    try {
        await LoadModels();

        const folders = await readdir(ORIGINAL_IMAGES_DIR);
        for (const folder of folders) {
            const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);

            // Get the user ID for the current folder (user)
            const sqlGetUserID = `SELECT ID FROM user WHERE FullName = ?`;
            db.query(sqlGetUserID, [folder], async (err, result) => {
                if (err) {
                    console.error(`Error getting user ID for ${folder}:`, err);
                    return;
                }

                const userID = result[0].ID;
                await trainModel(folderPath, userID); // Wait for training model to complete
                await simulateAttendance(folderPath, userID); // Simulate attendance after training
            });
        }
    } catch (error) {
        console.error("Error in main function:", error);
    }
}


app.post('/train_and_evaluate', async (req, res) => {
    try {
        await prepareData();
        await main();
        res.status(200).json({ message: "Training and evaluation completed" });
    } catch (err) {
        console.error("Error during training and evaluation:", err);
        res.status(500).json({ error: "Error during training and evaluation" });
    }
});




























app.listen(8081, () => {
    console.log("Đang chạy trên cổng 8081");
});
