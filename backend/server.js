const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require('multer'); // Thêm dòng này để yêu cầu module multer

const app = express();
app.use(express.static('public'));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use('public/Images', express.static(path.join(__dirname, 'public/Images'))); // Serve static files from the "uploads" directory

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "qlcc"
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get("/CRUD_User", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
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
    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User created successfully");
    });
});

app.put('/update_user/:id', (req, res) => {
    const sql = "UPDATE user SET `Email`=?, `FullName`=?, `Sex`=?, `BirthDay`=?, `Telephone`=?, `Address`=?, `ID_Department`=?, `HSLuong`=? WHERE ID=?";
    const values = [
        req.body.email,
        req.body.fullName,
        req.body.sex,
        req.body.dob,
        req.body.phoneNumber,
        req.body.address,
        req.body.id_departments,
        req.body.hsl
    ]
    const id = req.params.id;
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User update successfully");
    });
});

app.delete('/Delete_user/:id', (req, res) => {
    const sql = "DELETE FROM user WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User delete successfully");
    });
});

app.get("/CRUD_ImgUser", (req, res) => {
    const sql = "SELECT * FROM userimage";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

app.delete('/Delete_ImgUser/:id', (req, res) => {
    const sql = "DELETE FROM userimage WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("Img delete successfully");
    });
});

app.post('/create_ImgUser', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO userimage (UserName, Image, ID_User) VALUES ?";
    const values = [
        [
            req.body.username,
            req.file.filename,
            req.body.id_user
        ]
    ];

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }
        return res.status(200).json("Img created successfully");
    });
});


// Thêm vào endpoint đăng nhập  
app.post('/login', (req, res) => {
    console.log("Received login request with email:", req.body.email);
    const sql = "SELECT * FROM account WHERE `Email` = ? AND `Password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.json({ Message: "Server side error" });
        }
        if (data.length > 0) {
            const user = data[0];
            const token = jwt.sign({ ID_User: user.ID_User, role: user.role }, "our-jsontoken-secret-key", { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true, secure: false, path: '/' });
            console.log("Generated token for user:", token); // Kiểm tra xem token đã được tạo thành công và được gửi về client không
            return res.json({ Status: "Success", role: user.role });
        } else {
            console.log("No record found for email:", req.body.email);
            return res.json({ Message: "NO Record existed" });
        }
    });
});

// Thêm endpoint để đăng xuất
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    console.log("Logout successfully");
    res.json({ message: "Logout successfully" });
});

// Endpoint để lấy thông tin người dùng
// app.get('/user', (req, res) => {
//     const token = req.cookies?.token;
//     console.log("Token:", token);
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     try {
//         const decoded = jwt.verify(token, "our-jsontoken-secret-key");
//         const userId = decoded.ID_User;
//         db.query("SELECT FullName FROM user WHERE ID = ?", [userId], (err, data) => {
//             if (err) {
//                 return res.status(500).json({ message: "Server side error" });
//             }
//             if (data.length === 0) {
//                 return res.status(404).json({ message: "User not found" });
//             }
//             const user = data[0];
//             return res.status(200).json({ fullName: user.FullName });
//         });
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// });

app.listen(8081, () => {
    console.log("listening on port 8081");
});
