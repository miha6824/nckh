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


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "qlcc",
    waitForConnections: true,
    connectionLimit: 10,
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
    const sql = "SELECT * FROM department WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        if (data.length === 0) return res.status(404).json("Không tìm thấy phòng ban");
        return res.status(200).json(data[0].TenPhongBan);
    });
});

app.post('/create_Department', (req, res) => {
    const sql = "INSERT INTO Department (TenPhongBan) VALUES ?";
    const values = [
        [
            req.body.tenphongban,
        ]
    ];

    // Thực hiện truy vấn vào cơ sở dữ liệu
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thực hiện truy vấn:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi tạo phòng ban dòng 102');
        }
        console.log('phòng ban đã được tạo thành công dòng 105');
        return res.status(200).json('phòng ban đã được tạo thành công dòng 105');
    });
});

app.put('/update_Department/:id', (req, res) => {
    const sqlUpdateDepartment = "UPDATE department SET `TenPhongBan`=? WHERE ID=?";
    const valuesDepartment = [
        req.body.TenPhongBan
    ];
    const id = req.params.id;
    db.query(sqlUpdateDepartment, [...valuesDepartment, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        return res.status(200).json("Department updated successfully");
    });
});

app.delete('/Delete_department/:id', (req, res) => {
    const id = req.params.id;

    // Kiểm tra xem có nhân viên nào trong phòng ban không
    const checkEmployeesSql = "SELECT COUNT(*) AS employeeCount FROM user WHERE ID_Department = ?";
    db.query(checkEmployeesSql, [id], (err, data) => {
        if (err) {
            return res.status(500).json("Error");
        }

        if (data[0].employeeCount > 0) {
            return res.status(400).json("Phòng ban vẫn còn nhân viên");
        }

        // Nếu không có nhân viên nào trong phòng ban, tiến hành xóa phòng ban
        const deleteSql = "DELETE FROM department WHERE ID = ?";
        db.query(deleteSql, [id], (err, data) => {
            if (err) {
                return res.status(500).json("Error");
            }
            return res.status(200).json("Department deleted successfully");
        });
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
    const updateAccountSql = "UPDATE account SET `Email`=?, `Password`=?, `ID_User`=?, `Role`=? WHERE ID=?";
    const updateUserEmailSql = "UPDATE user SET `Email`=? WHERE ID=?";
    const { email, password, role } = req.body;

    // Kiểm tra role hợp lệ
    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json("Vai trò không hợp lệ. Vai trò chỉ có thể là 'user' hoặc 'admin'.");
    }

    // Kiểm tra mật khẩu không chứa ký tự tiếng Việt hoặc dấu
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    if (vietnamesePattern.test(password)) {
        return res.status(400).json("Mật khẩu không được chứa các ký tự tiếng Việt hoặc dấu.");
    }

    // Fetch ID_User from the account table
    db.query("SELECT ID_User, Email FROM account WHERE ID=?", [req.params.id], (err, result) => {
        if (err) {
            console.log("Error fetching account data:", err);
            return res.status(500).json("Error fetching account data");
        }

        const currentEmail = result[0].Email;
        const id_user = result[0].ID_User;

        const values = [email, password, id_user, role, req.params.id];

        // Update account table
        db.query(updateAccountSql, values, (err, accountResult) => {
            if (err) {
                console.log("Error updating account:", err);
                return res.status(500).json("Error updating account");
            }

            if (currentEmail !== email) {
                // Update user table if email has changed
                db.query(updateUserEmailSql, [email, id_user], (err, userResult) => {
                    if (err) {
                        console.log("Error updating user email:", err);
                        return res.status(500).json("Error updating user email");
                    }
                    return res.status(200).json("User and email updated successfully");
                });
            } else {
                return res.status(200).json("User and role updated successfully");
            }
        });
    });
});







app.get("/CRUD_Attendance", (req, res) => {
    const sql = "SELECT a.ID, a.ID_User, u.FullName, a.timestamp, a.Status, a.Image, a.LateMinutes, a.EarlyLeaveMinutes, a.OvertimeMinutes " +
        "FROM attendance a " +
        "INNER JOIN user u ON a.ID_User = u.ID";
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
    const checkUserSql = `
        SELECT * FROM user 
        WHERE Email = ? AND FullName = ? AND Sex = ? AND BirthDay = ? AND Telephone = ? AND Address = ? AND ID_Department = ? AND HSLuong = ?`;

    const checkUserValues = [
        req.body.email,
        req.body.fullName,
        req.body.sex,
        req.body.dob,
        req.body.phoneNumber,
        req.body.address,
        req.body.id_departments,
        req.body.hsl,
    ];

    db.query(checkUserSql, checkUserValues, (err, results) => {
        if (err) {
            console.error('Lỗi khi kiểm tra người dùng:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi kiểm tra người dùng');
        }

        if (results.length > 0) {
            return res.status(400).json('Người dùng đã tồn tại');
        } else {
            const userSql = "INSERT INTO user (Email, FullName, Sex, BirthDay, Telephone, Address, ID_Department, HSLuong) VALUES ?";
            const accountSql = "INSERT INTO account (Email, Password, ID_User, Role) VALUES ?";
            const defaultPassword = '12345';
            const defaultPositionId = 7; // ID của chức vụ mặc định (Nhân viên)

            const userValues = [
                [
                    req.body.email,
                    req.body.fullName,
                    req.body.sex,
                    req.body.dob,
                    req.body.phoneNumber,
                    req.body.address,
                    req.body.id_departments,
                    req.body.hsl,
                ]
            ];

            db.query(userSql, [userValues], (err, result) => {
                if (err) {
                    console.error('Lỗi khi thực hiện truy vấn:', err.stack);
                    return res.status(500).json('Đã xảy ra lỗi khi tạo người dùng');
                }

                const userId = result.insertId;
                const accountValues = [
                    [
                        req.body.email,
                        defaultPassword,
                        userId,
                        'user'
                    ]
                ];

                db.query(accountSql, [accountValues], (err, result) => {
                    if (err) {
                        console.error('Lỗi khi thêm tạo tài khoản:', err.stack);
                        return res.status(500).json('Đã xảy ra lỗi khi tạo tài khoản');
                    }

                    console.log('Người dùng và tài khoản đã được tạo thành công');

                    const positionSql = "INSERT INTO `position details` (MaCV, ID_User, ID_Department) VALUES ?";
                    const positionDetailsValues = [
                        [
                            defaultPositionId,
                            userId,
                            req.body.id_departments
                        ]
                    ];

                    db.query(positionSql, [positionDetailsValues], (err, result) => {
                        if (err) {
                            console.error('Lỗi khi thêm chức vụ', err.stack);
                            return res.status(500).json('Đã xảy ra lỗi khi thêm chức vụ');
                        }

                        console.log('Người dùng và tài khoản đã được tạo và thêm chức vụ thành công');
                        return res.status(200).json('Người dùng, tài khoản và chức vụ đã được tạo thành công');
                    });
                });
            });
        }
    });
});






app.put('/update_user/:id', (req, res) => {
    const sqlUpdateUser = "UPDATE user SET `Email`=?, `FullName`=?, `Sex`=?, `BirthDay`=?, `Telephone`=?, `Address`=?, `ID_Department`=?, `HSLuong`=? WHERE ID=?";
    const positionSql = "UPDATE `position details` SET `ID_Department`=? WHERE ID_User = ?";
    const dobFormatted = moment(req.body.dob).format('YYYY-MM-DD');
    const valuesUser = [
        req.body.email,
        req.body.fullName,
        req.body.sex,
        dobFormatted,
        req.body.phoneNumber,
        req.body.address,
        req.body.id_departments,
        req.body.hsl,
        req.params.id
    ];
    const id = req.params.id;

    const valuesPosition = [
        [
            req.body.id_departments
        ]
    ];

    db.query(sqlUpdateUser, valuesUser, (err, data) => {
        if (err) {
            console.error("Lỗi cơ sở dữ liệu:", err);
            return res.status(500).json("Lỗi");
        }

        // Thực hiện câu lệnh SQL insert vào position details
        db.query(positionSql, [...valuesPosition, id], (err, data) => {
            if (err) {
                console.error("Lỗi cơ sở dữ liệu:", err);
                return res.status(500).json("Lỗi");
            }
            return res.status(200).json("Cập nhật người dùng thành công");
        });
    });
});




app.delete('/Delete_user/:id', (req, res) => {
    const id = req.params.id;
    const deleteAccountSql = "DELETE FROM account WHERE ID_User=?";
    const deleteImgUserSql = "DELETE FROM userimage WHERE ID_User=?";
    const deleteAttendance = "DELETE FROM attendance WHERE ID_User=?";
    const deletePosition = "DELETE FROM `position details` WHERE ID_User=?";
    const deleteUserSql = "DELETE FROM user WHERE ID=?";

    // Xóa các bản ghi liên quan trước
    db.query(deleteAccountSql, [id], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Error deleting related account records");
        }
        db.query(deleteImgUserSql, [id], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json("Error deleting user images");
            }
            db.query(deleteAttendance, [id], (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json("Error deleting attendance records");
                }
                db.query(deletePosition, [id], (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json("Error deleting position details");
                    }
                    db.query(deleteUserSql, [id], (err, data) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json("Error deleting user");
                        }
                        return res.status(200).json("User deleted successfully");
                    });
                });
            });
        });
    });
});



app.get('/CRUD_positions', (req, res) => {
    const sql = `
    SELECT u.FullName, d.TenPhongBan, pd.ID, p.TenCV 
    FROM user u 
    JOIN \`position details\` pd ON u.ID = pd.ID_User 
    JOIN department d ON u.ID_Department = d.ID 
    JOIN position p ON pd.MaCV = p. ID
    `;

    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching positions:', err);
            return res.status(500).json("Error");
        }
        return res.status(200).json(data);
    });
});

app.get('/user_position/:id', (req, res) => {
    const id = req.params.id;

    const sql =
        `
            SELECT p.TenCV
            FROM \`position details\` pd
            INNER JOIN \`position\` p ON pd.MaCV = p.ID
            WHERE pd.ID_User = ?
        `
        ;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn SQL:', err);
            res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Không tìm thấy chức vụ cho nhân viên này' });
        } else {
            const position = results[0].TenCV;
            res.json({ position });
        }
    });
});





app.get("/positions", (req, res) => {
    const sql = "SELECT * FROM position";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

app.delete('/Delete_position_detail/:id', (req, res) => {
    const sql = "DELETE FROM `position details` WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json("User delete successfully");
    });
});

// Gán chức vụ cho nhân viên
app.post('/assign_position', (req, res) => {
    const sql = "INSERT INTO `position details` (MaCV, ID_User,ID_Department) VALUES ?";
    const values = [
        [
            req.body.MaCV,
            req.body.ID_User,
            req.body.ID_Department
        ]
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error assigning position:', err.stack);
            return res.status(500).json('Error assigning position');
        }
        res.status(200).json('Position assigned successfully');
    });
});


// Endpoint để lấy dữ liệu người dùng dựa trên ID
app.get('/position_details/:id', (req, res) => {
    const id = req.params.id;
    console.log("Received user ID:", id);

    const sql = "SELECT * FROM `position details` WHERE ID = ?";
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

app.put('/update_position/:id', (req, res) => {
    const sqlUpdatePosition = "UPDATE `position details` SET `MaCV`=?, `ID_User`=?, `ID_Department`=? WHERE ID=?";
    const valuesUserPosition = [
        req.body.MaCV,
        req.body.ID_User,
        req.body.ID_Department,
    ];
    const id = req.params.id;
    db.query(sqlUpdatePosition, [...valuesUserPosition, id], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        return res.status(200).json("User updated successfully");
    });
});





// Endpoint để lấy danh sách các chức vụ
app.get('/positions', (req, res) => {
    const sql = 'SELECT * FROM position';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching positions:', err);
            res.status(500).json({ error: 'Error fetching positions' });
            return;
        }
        res.json(result);
    });
});

// Endpoint để thêm một chức vụ mới
app.post('/CreatePosition', (req, res) => {
    const sql = "INSERT INTO `position` (TenCV) VALUES ?";
    const values = [
        [
            req.body.tencv,
        ]
    ];

    // Thực hiện truy vấn vào cơ sở dữ liệu
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Lỗi khi thực hiện truy vấn:', err.stack);
            return res.status(500).json('Đã xảy ra lỗi khi tạo chức vụ dòng 666');
        }
        console.log('chức vụ đã được tạo thành công dòng 668');
        return res.status(200).json('chức vụ đã được tạo thành công dòng 669');
    });
});

// Endpoint để xoá một chức vụ
app.delete('/DeletePositions/:id', (req, res) => {
    const id = req.params.id;

    // Kiểm tra xem có người đang giữ chức vụ này trong bảng `position details`
    const checkSql = 'SELECT * FROM `position details` WHERE MaCV = ?';
    db.query(checkSql, [id], (err, result) => {
        if (err) {
            console.error('Error checking position details:', err);
            res.status(500).json({ error: 'Error checking position details' });
            return;
        }

        // Nếu có người đang giữ chức vụ này, không cho phép xóa
        if (result.length > 0) {
            res.status(400).json({ error: 'Chức vụ đang có người giữ, không thể xóa' });
            return;
        }

        // Nếu không có người đang giữ, tiến hành xóa chức vụ từ bảng `position`
        const deleteSql = 'DELETE FROM `position` WHERE ID = ?';
        db.query(deleteSql, [id], (err, result) => {
            if (err) {
                console.error('695 Lỗi xóa chức vụ:', err);
                res.status(500).json({ error: 'Lỗi xóa chức vụ' });
                return;
            }
            res.json({ message: 'Xóa chức vụ thành công' });
        });
    });
});



app.get('/PositionName/:id', (req, res) => {
    const sql = "SELECT * FROM position WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json("Error");
        if (data.length === 0) return res.status(404).json("không tìm thấy chức vụ");
        return res.status(200).json(data[0]);
    });
});


// Endpoint để cập nhật một chức vụ
app.put('/UpdatePositions/:id', (req, res) => {
    const sqlUpdatePosition = "UPDATE position SET `TenCV`=? WHERE ID=?";
    const valuesPosition = [
        req.body.tencv
    ];
    const id = req.params.id;
    db.query(sqlUpdatePosition, [...valuesPosition, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        return res.status(200).json("Department updated successfully");
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

app.get("/CRUD_ImgUserforattendance", (req, res) => {
    const sql = `SELECT * FROM userimage`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.status(200).json(data);
    });
});

// xóa ảnh nhân viên
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
    console.log("789 ID up ảnh:", id);

    if (!req.file) {
        console.log("không có hình ảnh nào tải lên 791");
        return res.status(400).json({ error: "không có hình ảnh nào tải lên" });
    }

    // Thực hiện truy vấn SQL để lấy thông tin về UserName và ID_User từ bảng `user`
    const userInfoQuery = "SELECT FullName as Label, ID as ID_User FROM user WHERE ID = ?";
    db.query(userInfoQuery, [id], async (err, userInfo) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        if (userInfo.length === 0) {
            console.log("User not found");
            // Xóa ảnh nếu không tìm thấy người dùng
            fs.unlink(path.join(__dirname, 'public/Images', req.file.filename), (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting image file:", unlinkErr);
                }
            });
            return res.status(404).json({ error: "User not found" });
        }

        const label = userInfo[0].Label;
        const userId = userInfo[0].ID_User;

        const sql = "INSERT INTO userimage (Label, Image, ID_User, FaceDescriptor) VALUES ?";
        let progress = 0;
        try {
            console.log(`Progress: ${progress}% - bắt đầu tải ảnh`);

            // Bắt đầu quá trình trích xuất đặc trưng khuôn mặt từ ảnh
            progress += 20;
            const imagePath = path.join(__dirname, 'public/Images', req.file.filename);
            console.log(`Progress: ${progress} % - Loading image...`);
            const img = await canvas.loadImage(imagePath);

            progress += 20;
            console.log(`Progress: ${progress} % - tìm khuôn mặt để extract faceDescrip`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (!detections) {
                console.log(`Progress: ${progress} % - No face detected`);
                // Xóa ảnh nếu không phát hiện khuôn mặt
                fs.unlink(imagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error deleting image file:", unlinkErr);
                    }
                });
                return res.status(400).json({ error: "No face detected" });
            }

            progress += 20;
            console.log(`Progress: ${progress} % -tìm thấy khuôn mặt bắt đầu extract`);
            const descriptor = detections.descriptor;
            const descriptorArray = Array.from(descriptor);

            progress += 20;
            console.log(`Progress: ${progress} % - chuyển thành ma trận 32-bit`);

            const values = [
                [
                    label,
                    req.file.filename,
                    userId,
                    JSON.stringify(descriptorArray)
                ]
            ];

            progress += 20;
            console.log(`Progress: ${progress} % - lưu vào db`);
            db.query(sql, [values], (err, data) => {
                if (err) {
                    console.error("Database error:", err);
                    // Xóa ảnh nếu lỗi lưu vào database
                    fs.unlink(imagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error("Error deleting image file:", unlinkErr);
                        }
                    });
                    return res.status(500).json("Error");
                }
                console.log(`Progress: 100 % - lưu data thành công`);
                return res.status(200).json("lưu ảnh và faceDescription thành công");
            });
        } catch (error) {
            console.error("Face API error:", error);
            // Xóa ảnh nếu có lỗi trong quá trình xử lý ảnh
            fs.unlink(path.join(__dirname, 'public/Images', req.file.filename), (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting image file:", unlinkErr);
                }
            });
            return res.status(500).json("Error processing image");
        }
    });
});


// Thêm vào endpoint đăng nhập  
app.post('/login', (req, res) => {
    console.log("Received email:", req.body.email);
    const sql = "SELECT * FROM account WHERE Email = ? AND Password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
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


// Endpoint tạo tài khoản nhân viên
app.post('/register', (req, res) => {
    const { email, password, fullName, sex, birthday, telephone, address } = req.body;
    const sqlCheck = "SELECT * FROM account WHERE Email = ?";
    const sqlInsertUser = "INSERT INTO user (Email, FullName, Sex, BirthDay, Telephone, Address) VALUES (?, ?, ?, ?, ?, ?)";
    const sqlInsertAccount = "INSERT INTO account (Email, Password, ID_User, Role) VALUES (?, ?, ?, ?)";
    const sqlInsertPositionDetails = "INSERT INTO `position details` (ID_User, MaCV) VALUES (?, ?)";

    db.query(sqlCheck, [email], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }
        if (data.length > 0) {
            return res.status(409).json("Email đã tồn tại");
        } else {
            db.query(sqlInsertUser, [email, fullName, sex, birthday, telephone, address], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json("Error");
                }
                const userID = result.insertId;
                const role = "user";

                db.query(sqlInsertAccount, [email, password, userID, role], (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json("Error");
                    }

                    db.query(sqlInsertPositionDetails, [userID, 7], (err, result) => {
                        if (err) {
                            console.error("Database error:", err);
                            return res.status(500).json("Error");
                        }
                        return res.status(200).json("User registered successfully with default position details");
                    });
                });
            });
        }
    });
});




// API endpoint để lấy tất cả ảnh của người dùng dựa trên ID_User
app.get('/userImages/:userID', (req, res) => {
    const userID = req.params.userID;
    const sql = `SELECT * FROM userimage WHERE ID_User = ? `;
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


    const getImageSql = `SELECT Image FROM userimage WHERE ID_User = ? AND ID = ? `;
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
        const deleteSql = `DELETE FROM userimage WHERE ID_User = ? AND ID = ? `;
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
    console.log("yêu cầu upload ảnh của id:", id);

    if (!req.file) {
        console.log("không có hình ảnh nào tải lên");
        return res.status(400).json({ error: "không có hình ảnh nào tải lên" });
    }

    const sql = "INSERT INTO userimage (Label, Image, ID_User, FaceDescriptor) VALUES ?";
    let progress = 0;
    try {
        console.log(`Progress: ${progress} % - Starting image processing...`);

        // Bắt đầu quá trình trích xuất đặc trưng khuôn mặt từ ảnh
        progress += 20;
        const imagePath = path.join(__dirname, 'public/Images', req.file.filename);
        console.log(`Progress: ${progress} % - Loading image...`);
        const img = await canvas.loadImage(imagePath);

        progress += 20;
        console.log(`Progress: ${progress} % - Tìm khuôn mặt để extrac faceDescrip`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detections) {
            console.log(`Progress: ${progress} % - No face detected`);
            return res.status(400).json({ error: "No face detected" });
        }

        progress += 20;
        console.log(`Progress: ${progress} % - bắt đầu extrac faceDescrip`);
        const descriptor = detections.descriptor;
        const descriptorArray = Array.from(descriptor); // Chuyển đổi Float32Array thành mảng thường để lưu vào MySQL

        progress += 20;
        console.log(`Progress: ${progress} % - chuyển sang mảng 32-bit`);

        const values = [
            [
                req.body.username,
                req.file.filename,
                req.body.id_user,
                JSON.stringify(descriptorArray)
            ]
        ];

        progress += 20;
        console.log(`Progress: ${progress} % - tải lên db`);
        db.query(sql, [values], (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json("Error");
            }
            console.log(`Progress:Hoàn thành`);
            return res.status(200).json("tạo ảnh và lưu faceDescrip thành công");
        });
    } catch (error) {
        console.error("lỗi face-api:", error);
        // Xóa ảnh nếu có lỗi trong quá trình xử lý ảnh
        fs.unlink(path.join(__dirname, 'public/Images', req.file.filename), (unlinkErr) => {
            if (unlinkErr) {
                console.error("lỗi xóa ảnh:", unlinkErr);
            }
        });
        return res.status(500).json("lỗi tải ảnh");
    }
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
        INSERT INTO standard_times(date, checkin_time, checkout_time)
        VALUES(?, ?, ?)
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



app.get('/getStandardTimes', (req, res) => {
    const { month, year } = req.query;

    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
    const endDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

    const sql = `
        SELECT date, checkin_time, checkout_time
        FROM standard_times
        WHERE date BETWEEN ? AND ?
    `;

    db.query(sql, [startDate, endDate], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json("Error");
        }

        const defaultCheckinTime = "08:00:00";
        const defaultCheckoutTime = "17:00:00";

        const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
        const workSchedule = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
            const standardTime = data.find(item => moment(item.date).format('YYYY-MM-DD') === currentDate);
            workSchedule.push({
                date: currentDate,
                checkin_time: standardTime ? standardTime.checkin_time : defaultCheckinTime,
                checkout_time: standardTime ? standardTime.checkout_time : defaultCheckoutTime
            });
        }

        return res.status(200).json(workSchedule);
    });
});


// Endpoint để ghi nhận điểm danh
app.post('/attendance', (req, res) => {
    const { userId, fullName, imageBase64 } = req.body;
    const lateCheckInThreshold = 1; // sao bao nhiểu phút được tính là checkin muộn
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

            handleAttendance(userId, imageBase64, result, currentTime, currentMinutes, standardCheckInTime, standardCheckOutTime, lateCheckInThreshold, overTimeThreshold, res);
        });
    });
});

function handleAttendance(userId, imageBase64, lastAttendanceResult, currentTime, currentMinutes, standardCheckInTime, standardCheckOutTime, lateCheckInThreshold, overTimeThreshold, res) {
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
            const insertAttendanceSql = "INSERT INTO attendance (ID_User, Image, Status, EarlyLeaveMinutes, OvertimeMinutes) VALUES (?, ?, ?, ?, ?)";
            db.query(insertAttendanceSql, [userId, imageBase64, Status, earlyLeaveMinutes, overtimeMinutes], (err, result) => {
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
            const insertAttendanceSql = "INSERT INTO attendance (ID_User, Image, Status, LateMinutes) VALUES (?, ?, ?, ?)";
            db.query(insertAttendanceSql, [userId, imageBase64, Status, lateMinutes], (err, result) => {
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
        const insertAttendanceSql = "INSERT INTO attendance (ID_User, Image, Status, LateMinutes) VALUES (?, ?, ?, ?)";
        db.query(insertAttendanceSql, [userId, imageBase64, Status, lateMinutes], (err, result) => {
            if (err) {
                console.error("Lỗi khi thêm bản ghi điểm danh:", err);
                return res.status(500).json("Lỗi khi lưu điểm danh");
            }
            return res.status(200).json("Điểm danh thành công");
        });
    }
}


app.post('/addAttendance', upload.single('image'), async (req, res) => {
    try {
        const { ID_User, checkinTime, checkoutTime } = req.body;
        const image = req.file;

        // Chuyển ảnh sang dạng base64
        const imgPath = image.path;
        const imgBuffer = fs.readFileSync(imgPath);
        const imgBase64 = imgBuffer.toString('base64');

        // Tính toán thời gian chấm công
        const standardCheckin = new Date();
        standardCheckin.setHours(8, 0, 0); // Giờ checkin tiêu chuẩn là 8:00 AM
        const standardCheckout = new Date();
        standardCheckout.setHours(17, 0, 0); // Giờ checkout tiêu chuẩn là 5:00 PM

        const actualCheckin = new Date(checkinTime);
        const actualCheckout = new Date(checkoutTime);

        const lateMinutes = Math.max(0, (actualCheckin - standardCheckin) / (1000 * 60));
        const earlyLeaveMinutes = Math.max(0, (standardCheckout - actualCheckout) / (1000 * 60));
        const overtimeMinutes = Math.max(0, (actualCheckout - standardCheckout) / (1000 * 60));

        // Thêm bản ghi checkin
        const checkinSql = "INSERT INTO attendance (ID_User, timestamp, Status, Image, LateMinutes) VALUES (?, ?, 'checkin', ?, ?)";
        await db.query(checkinSql, [ID_User, checkinTime, imgBase64, lateMinutes]);

        // Thêm bản ghi checkout
        const checkoutSql = "INSERT INTO attendance (ID_User, timestamp, Status, Image, EarlyLeaveMinutes, OvertimeMinutes) VALUES (?, ?, 'checkout', ?, ?, ?)";
        await db.query(checkoutSql, [ID_User, checkoutTime, imgBase64, earlyLeaveMinutes, overtimeMinutes]);

        fs.unlinkSync(imgPath); // Xóa ảnh tạm sau khi xử lý xong

        res.status(200).json({ message: 'Attendance added successfully' });
    } catch (error) {
        console.error('Error adding attendance:', error);
        res.status(500).json({ error: 'Error adding attendance' });
    }
});







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
                    const insertAbsenceSql = "INSERT INTO attendance (ID_User, Image, Status) VALUES (?, ?, ?)";
                    const imageBase64 = "nghỉ làm";
                    const status = "nghỉ làm";

                    db.query(insertAbsenceSql, [user.ID, imageBase64, status], (err, result) => {
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

    let query;
    let queryParams;

    if (employee === "Tất cả nhân viên") {
        query = `
            SELECT u.FullName,
                SUM(a.LateMinutes) AS TotalLateMinutes,
                SUM(a.EarlyLeaveMinutes) AS TotalEarlyLeaveMinutes,
                SUM(a.OvertimeMinutes) AS TotalOvertimeMinutes,
                SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, a.CheckIn, a.CheckOut))) AS TotalWorkHours,
                ROUND(SUM(TIMESTAMPDIFF(SECOND, a.CheckIn, a.CheckOut)) / 32400, 2) AS TotalWorkDays -- 32400 giây = 9 giờ
            FROM (
                SELECT ID_User,
                    MIN(CASE WHEN Status LIKE 'check in%' THEN timestamp END) AS CheckIn,
                    MAX(CASE WHEN Status LIKE 'check out%' THEN timestamp END) AS CheckOut,
                    SUM(LateMinutes) AS LateMinutes,
                    SUM(EarlyLeaveMinutes) AS EarlyLeaveMinutes,
                    SUM(OvertimeMinutes) AS OvertimeMinutes
                FROM attendance
                WHERE DATE(timestamp) BETWEEN ? AND ?
                GROUP BY ID_User, DATE(timestamp)
            ) a
            JOIN user u ON a.ID_User = u.ID
            WHERE u.ID_Department = ?
            GROUP BY u.FullName
        `;
        queryParams = [startDate, endDate, department];
    } else {
        query = `
            SELECT a.ID_User, u.FullName, DATE(a.timestamp) AS Date,
                MIN(CASE WHEN a.Status LIKE 'check in%' THEN TIME(a.timestamp) END) AS CheckIn,
                MAX(CASE WHEN a.Status LIKE 'check out%' THEN TIME(a.timestamp) END) AS CheckOut,
                SUM(a.LateMinutes) AS LateMinutes,
                SUM(a.EarlyLeaveMinutes) AS EarlyLeaveMinutes,
                SUM(a.OvertimeMinutes) AS OvertimeMinutes
            FROM attendance a
            JOIN user u ON a.ID_User = u.ID
            WHERE u.ID_Department = ? AND u.ID = ? AND DATE(a.timestamp) BETWEEN ? AND ?
            GROUP BY a.ID_User, u.FullName, DATE(a.timestamp)
        `;
        queryParams = [department, employee, startDate, endDate];
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error generating report:', err);
            res.status(500).json({ error: 'Error generating report' });
        } else {
            res.json(results);
        }
    });
});



const excel = require('exceljs');

app.post('/export-to-excel', async (req, res) => {
    const { employee, startDate, endDate, departmentId } = req.body;

    try {
        const workbook = new excel.Workbook();
        let worksheet;

        if (employee === 'Tất cả nhân viên') {
            worksheet = workbook.addWorksheet('Tổng hợp báo cáo');

            worksheet.columns = [
                { header: 'Tên nhân viên', key: 'FullName', width: 20 },
                { header: 'Tổng thời gian đi muộn (phút)', key: 'TotalLateMinutes', width: 30 },
                { header: 'Tổng thời gian về sớm (phút)', key: 'TotalEarlyLeaveMinutes', width: 30 },
                { header: 'Tổng thời gian tăng ca (phút)', key: 'TotalOvertimeMinutes', width: 30 },
                { header: 'Tổng thời gian làm việc (giờ)', key: 'TotalWorkHours', width: 30 },
                { header: 'Số công', key: 'TotalWorkDays', width: 15 }
            ];

            const summaryQuery = `
                SELECT u.FullName,
                SUM(a.LateMinutes) AS TotalLateMinutes,
                SUM(a.EarlyLeaveMinutes) AS TotalEarlyLeaveMinutes,
                SUM(a.OvertimeMinutes) AS TotalOvertimeMinutes,
                SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, a.CheckIn, a.CheckOut))) AS TotalWorkHours,
                ROUND(SUM(TIMESTAMPDIFF(SECOND, a.CheckIn, a.CheckOut)) / 32400, 2) AS TotalWorkDays
                FROM (
                    SELECT ID_User,
                        MIN(CASE WHEN Status LIKE 'check in%' THEN timestamp END) AS CheckIn,
                        MAX(CASE WHEN Status LIKE 'check out%' THEN timestamp END) AS CheckOut,
                        SUM(LateMinutes) AS LateMinutes,
                        SUM(EarlyLeaveMinutes) AS EarlyLeaveMinutes,
                        SUM(OvertimeMinutes) AS OvertimeMinutes
                    FROM attendance
                    WHERE DATE(timestamp) BETWEEN ? AND ?
                    GROUP BY ID_User, DATE(timestamp)
                ) a
                JOIN user u ON a.ID_User = u.ID
                WHERE u.ID_Department = ?
                GROUP BY u.FullName
            `;

            const summaryResults = await new Promise((resolve, reject) => {
                db.query(summaryQuery, [startDate, endDate, departmentId], (err, results) => {
                    if (err) {
                        console.error('Error fetching summary data:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            worksheet.addRows(summaryResults.map(result => ({
                FullName: result.FullName,
                TotalLateMinutes: result.TotalLateMinutes,
                TotalEarlyLeaveMinutes: result.TotalEarlyLeaveMinutes,
                TotalOvertimeMinutes: result.TotalOvertimeMinutes,
                TotalWorkHours: moment(result.TotalWorkHours, 'HH:mm:ss').format('HH:mm:ss'),
                TotalWorkDays: result.TotalWorkDays
            })));
        } else {
            worksheet = workbook.addWorksheet('Chi tiết báo cáo');

            worksheet.columns = [
                { header: 'Tên nhân viên', key: 'FullName', width: 20 },
                { header: 'Ngày', key: 'Date', width: 15 },
                { header: 'Check-in', key: 'CheckIn', width: 15 },
                { header: 'Check-out', key: 'CheckOut', width: 15 },
                { header: 'Thời gian đi muộn (phút)', key: 'LateMinutes', width: 20 },
                { header: 'Thời gian về sớm (phút)', key: 'EarlyLeaveMinutes', width: 20 },
                { header: 'Thời gian tăng ca (phút)', key: 'OvertimeMinutes', width: 20 }
            ];

            const detailedQuery = `
                SELECT u.FullName, DATE(a.timestamp) AS Date,
                    MIN(CASE WHEN a.Status LIKE 'check in%' THEN TIME(a.timestamp) END) AS CheckIn,
                    MAX(CASE WHEN a.Status LIKE 'check out%' THEN TIME(a.timestamp) END) AS CheckOut,
                    SUM(a.LateMinutes) AS LateMinutes,
                    SUM(a.EarlyLeaveMinutes) AS EarlyLeaveMinutes,
                    SUM(a.OvertimeMinutes) AS OvertimeMinutes
                FROM attendance a
                JOIN user u ON a.ID_User = u.ID
                WHERE a.ID_User = ? AND DATE(a.timestamp) BETWEEN ? AND ?
                GROUP BY u.FullName, DATE(a.timestamp)
            `;
            const detailedResults = await new Promise((resolve, reject) => {
                db.query(detailedQuery, [employee, startDate, endDate], (err, results) => {
                    if (err) {
                        console.error('Error fetching detailed data:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            worksheet.addRows(detailedResults.map(result => ({
                FullName: result.FullName,
                Date: moment(result.Date).format('YYYY-MM-DD'),
                CheckIn: result.CheckIn ? moment(result.CheckIn, 'HH:mm:ss').format('HH:mm:ss') : null,
                CheckOut: result.CheckOut ? moment(result.CheckOut, 'HH:mm:ss').format('HH:mm:ss') : null,
                LateMinutes: result.LateMinutes,
                EarlyLeaveMinutes: result.EarlyLeaveMinutes,
                OvertimeMinutes: result.OvertimeMinutes
            })));
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${employee === 'Tất cả nhân viên' ? 'TongHopBaoCao' : `ChiTietBaoCao_${employee}`}_${startDate}_to_${endDate}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).send('Error exporting to Excel');
    }
});





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













// Mô hình tính toán độ chính xác
const { readdir } = require('fs').promises;

const TRAINTEST_DIR = path.join(__dirname, 'traintest');

async function resizeImage(imgPath, width = 224, height = 224) {
    const img = await canvas.loadImage(imgPath);
    const resizedCanvas = canvas.createCanvas(width, height);
    const ctx = resizedCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return resizedCanvas;
}

async function prepareData() {
    const folders = await readdir(TRAINTEST_DIR);
    for (const folder of folders) {
        const folderPath = path.join(TRAINTEST_DIR, folder);
        const files = await readdir(folderPath);
        const totalFiles = files.length;
        const trainSize = Math.floor(totalFiles * 0.7);
        const testSize = totalFiles - trainSize;

        // Chia ảnh thành tập train và test
        const trainFiles = files.slice(0, trainSize);
        const testFiles = files.slice(trainSize);

        // Lưu tập train và test vào folder riêng
        const trainDir = path.join(folderPath, 'train');
        const testDir = path.join(folderPath, 'test');
        if (!fs.existsSync(trainDir)) fs.mkdirSync(trainDir);
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        for (const file of trainFiles) {
            const filePath = path.join(folderPath, file);
            const resizedCanvas = await resizeImage(filePath);
            const newFilePath = path.join(trainDir, file);
            const out = fs.createWriteStream(newFilePath);
            const stream = resizedCanvas.createJPEGStream();
            stream.pipe(out);
            await new Promise(resolve => out.on('finish', resolve));
        }
        for (const file of testFiles) {
            const filePath = path.join(folderPath, file);
            const resizedCanvas = await resizeImage(filePath);
            const newFilePath = path.join(testDir, file);
            const out = fs.createWriteStream(newFilePath);
            const stream = resizedCanvas.createJPEGStream();
            stream.pipe(out);
            await new Promise(resolve => out.on('finish', resolve));
        }
    }
    console.log("prepareData completed");
}

async function trainModel(folderPath) {
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
            labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [detection.descriptor]));

            processedCount++;
            const progress = (processedCount / files.length) * 100;
            console.log(`Progress for ${path.basename(folderPath)}: ${progress.toFixed(2)}% `);
        } catch (error) {
            console.error(`Error processing file ${file} in ${folderPath}: `, error);
        }
    }

    return labeledDescriptors;
}

async function evaluateModel(folderPath, labeledDescriptors) {
    const testDir = path.join(folderPath, 'test');
    const files = await readdir(testDir);
    console.log(`Evaluating model for ${path.basename(folderPath)} with ${files.length} files`);

    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    let falsePredictions = []; // Mảng để lưu các tên file mà mô hình dự đoán sai

    for (const file of files) {
        try {
            const imgPath = path.join(testDir, file);
            const img = await canvas.loadImage(imgPath);
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (!detection) {
                if (path.basename(folderPath) === 'unknown') {
                    trueNegatives++;
                } else {
                    falseNegatives++;
                }
                continue;
            }

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

            if (bestMatch.label === path.basename(folderPath)) {
                truePositives++;
            } else {
                falsePredictions.push(file); // Thêm tên file vào mảng falsePredictions
                if (bestMatch.label === 'unknown') {
                    falseNegatives++;
                } else {
                    falsePositives++;
                }
            }
        } catch (error) {
            console.error(`Error processing file ${file} in ${folderPath}: `, error);
        }
    }

    const precision = truePositives / (truePositives + falsePositives);
    const recall = truePositives / (truePositives + falseNegatives);
    const f1Score = 2 * (precision * recall) / (precision + recall);

    console.log(`Precision for ${path.basename(folderPath)}: ${precision} `);
    console.log(`Recall for ${path.basename(folderPath)}: ${recall} `);
    console.log(`F1 Score for ${path.basename(folderPath)}: ${f1Score} `);
    console.log(`False predictions for ${path.basename(folderPath)}: `, falsePredictions); // In ra các tên file mà mô hình dự đoán sai

    return { precision, recall, f1Score, falsePredictions };
}

async function main() {
    try {
        await LoadModels();

        const folders = await readdir(TRAINTEST_DIR);
        for (const folder of folders) {
            const folderPath = path.join(TRAINTEST_DIR, folder);
            const labeledDescriptors = await trainModel(folderPath);
            const evaluation = await evaluateModel(folderPath, labeledDescriptors);
            console.log(`Evaluation for ${folder}: `, evaluation);
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



// Mô hình giả lập chấm công
const { promisify } = require('util');
// const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
// const ORIGINAL_IMAGES_DIR = path.join(__dirname, 'Original Images');

// async function prepareData() {
//     const folders = await readdir(ORIGINAL_IMAGES_DIR);
//     for (const folder of folders) {
//         const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);
//         const files = await readdir(folderPath);
//         const totalFiles = files.length;
//         const getFeatureSize = Math.floor(totalFiles * 0.5);
//         const attendanceSimulatorSize = totalFiles - getFeatureSize;

//         const email = `${ folder.replace(/\s/g, '') } @gmail.com`;
//         const password = '12345';
//         const fullName = folder;
//         const role = 'user';
//         const address = 'Hà Nội';
//         const gender = 'Nam';
//         const telephone = '0912345678';
//         const dob = '2002-12-24';

//         const sqlCreateUser = `INSERT INTO user(Email, FullName, Sex, BirthDay, Telephone, Address) VALUES(?,?,?,?,?,?)`;
//         db.query(sqlCreateUser, [email, fullName, gender, dob, telephone, address], (err, result) => {
//             if (err) throw err;
//             const userID = result.insertId;
//             const sqlCreateAccount = `INSERT INTO account(Email, Password, ID_User, Role) VALUES(?, ?, ?, ?)`;
//             db.query(sqlCreateAccount, [email, password, userID, role], (err, result) => {
//                 if (err) throw err;
//                 console.log(`Created account for ${ fullName }`);
//             });
//         });

//         const getFeatureFiles = files.slice(0, getFeatureSize);
//         const attendanceSimulatorFiles = files.slice(getFeatureSize);

//         const getFeatureDir = path.join(folderPath, 'getFeature');
//         const attendanceSimulatorDir = path.join(folderPath, 'attendanceSimulator');
//         if (!fs.existsSync(getFeatureDir)) fs.mkdirSync(getFeatureDir);
//         if (!fs.existsSync(attendanceSimulatorDir)) fs.mkdirSync(attendanceSimulatorDir);

//         for (const file of getFeatureFiles) {
//             fs.renameSync(path.join(folderPath, file), path.join(getFeatureDir, file));
//         }
//         for (const file of attendanceSimulatorFiles) {
//             fs.renameSync(path.join(folderPath, file), path.join(attendanceSimulatorDir, file));
//         }
//     }
//     console.log("prepareData completed");
// }

// // Hàm getFeatureModel để huấn luyện mô hình và lưu trữ mô tả khuôn mặt và ảnh
// async function getFeatureModel(folderPath, userID) {
//     const getFeatureDir = path.join(folderPath, 'getFeature');
//     const files = await readdir(getFeatureDir);
//     console.log(`getFeature model for ${ path.basename(folderPath) } with ${ files.length } files`);

//     const labeledDescriptors = [];
//     let processedCount = 0;

//     for (const file of files) {
//         try {
//             const imgPath = path.join(getFeatureDir, file);
//             const img = await canvas.loadImage(imgPath);
//             const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//             if (!detection) continue;

//             const label = path.basename(folderPath);
//             labeledDescriptors.push({
//                 label,
//                 descriptor: detection.descriptor
//             });

//             // Save image to public/Images folder with timestamp filename
//             const targetFileName = `${ Date.now() }${ path.extname(file) } `;
//             const targetPath = path.join('public', 'Images', targetFileName);
//             fs.copyFileSync(imgPath, targetPath);

//             processedCount++;
//             const progress = (processedCount / files.length) * 100;
//             console.log(`Progress for ${ path.basename(folderPath) }: ${ progress.toFixed(2) }% `);

//             // Convert Float32Array descriptor to JSON string for storage
//             const faceDescriptorFloat32 = Array.from(detection.descriptor); // Convert Float32Array to regular array
//             const faceDescriptorJSON = JSON.stringify(faceDescriptorFloat32);

//             // Save face descriptor to database
//             const sqlInsert = `INSERT INTO userimage(Label, Image, ID_User, FaceDescriptor) VALUES(?, ?, ?, ?)`;
//             db.query(sqlInsert, [label, targetFileName, userID, faceDescriptorJSON], (err, result) => {
//                 if (err) throw err;
//                 console.log(`Saved face descriptor for ${ label }`);
//             });

//         } catch (error) {
//             console.error(`Error processing file ${ file } in ${ folderPath }: `, error);
//         }
//     }

//     return labeledDescriptors;
// }


// async function simulateAttendance(folderPath, userID) {
//     const attendanceSimulatorDir = path.join(folderPath, 'attendanceSimulator');
//     const attendanceSimulatorFiles = await readdir(attendanceSimulatorDir);

//     const startDate = new Date('2024-07-01');
//     const endDate = new Date('2024-07-31');
//     const standardCheckInTime = 8; // 8 AM
//     const standardCheckOutTime = 17; // 5 PM
//     const maxLateCheckInMinutes = 30; // Số phút tối đa check-in muộn
//     const maxEarlyCheckOutMinutes = 120; // Số phút tối đa check-out sớm

//     // Định nghĩa sqlQuery ở đây để sử dụng trong các hàm con
//     const sqlQuery = `SELECT * FROM userimage WHERE ID_User = ? `;

//     // Hàm để tạo một tập hợp các ngày ngẫu nhiên tăng dần
//     function getRandomDates(startDate, endDate, count) {
//         const dates = [];
//         const date = new Date(startDate);
//         while (dates.length < count) {
//             date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1); // Tăng ngày lên ngẫu nhiên từ 1 đến 3 ngày
//             if (date > endDate) break;
//             dates.push(new Date(date));
//         }
//         return dates;
//     }

//     // Lấy 5 ngày ngẫu nhiên duy nhất trong tháng 7
//     const randomDates = getRandomDates(startDate, endDate, 10);

//     // Xử lý mỗi ngày ngẫu nhiên
//     for (const currentDate of randomDates) {
//         try {
//             // Chọn ngẫu nhiên thời gian check-in và check-out trong phạm vi cho phép
//             const checkInTime = new Date(currentDate);
//             checkInTime.setHours(standardCheckInTime, 0, 0, 0);
//             checkInTime.setMinutes(checkInTime.getMinutes() + Math.floor(Math.random() * maxLateCheckInMinutes));

//             const checkOutTime = new Date(currentDate);
//             checkOutTime.setHours(standardCheckOutTime, 0, 0, 0);
//             checkOutTime.setMinutes(checkOutTime.getMinutes() - Math.floor(Math.random() * maxEarlyCheckOutMinutes));

//             // Tính toán số phút đi trễ, về sớm và tăng ca
//             let lateMinutes = Math.max(0, checkInTime.getHours() * 60 + checkInTime.getMinutes() - (standardCheckInTime * 60));
//             let earlyLeaveMinutes = Math.max(0, (standardCheckOutTime * 60) - (checkOutTime.getHours() * 60 + checkOutTime.getMinutes()));
//             let overtimeMinutes = 0;

//             // Nếu có về sớm thì không có tăng ca và ngược lại
//             if (earlyLeaveMinutes > 0) {
//                 overtimeMinutes = 0;
//             } else {
//                 overtimeMinutes = Math.max(0, (checkOutTime.getHours() * 60 + checkOutTime.getMinutes()) - (standardCheckOutTime * 60));
//                 earlyLeaveMinutes = 0;
//             }

//             console.log(`Processing date: ${ currentDate.toLocaleDateString() } `);
//             console.log(`Check -in time: ${ checkInTime } `);
//             console.log(`Check - out time: ${ checkOutTime } `);

//             // Chọn ngẫu nhiên 1 ảnh trong thư mục attendanceSimulator cho check-in và 1 ảnh khác cho check-out
//             const randomFiles = [];
//             while (randomFiles.length < 2) {
//                 const randomFile = attendanceSimulatorFiles[Math.floor(Math.random() * attendanceSimulatorFiles.length)];
//                 if (!randomFiles.includes(randomFile)) {
//                     randomFiles.push(randomFile);
//                 }
//             }

//             // Load và xử lý ảnh cho check-in
//             const checkInImgPath = path.join(attendanceSimulatorDir, randomFiles[0]);
//             const checkInImg = await canvas.loadImage(checkInImgPath);
//             const checkInDetection = await faceapi.detectSingleFace(checkInImg).withFaceLandmarks().withFaceDescriptor();

//             if (checkInDetection) {
//                 const checkInDescriptor = Array.from(checkInDetection.descriptor); // Chuyển đổi Float32Array thành mảng thông thường
//                 const checkInDescriptorJSON = JSON.stringify(checkInDescriptor);

//                 // Đọc tệp ảnh và chuyển đổi thành base64
//                 const checkInImageBuffer = await readFile(checkInImgPath);
//                 const checkInImageBase64 = `data: image / jpeg; base64, ${ checkInImageBuffer.toString('base64') } `;

//                 // Truy vấn bảng userimage để tìm một bản khớp với face descriptor hiện tại
//                 const checkInResults = await new Promise((resolve, reject) => {
//                     db.query(sqlQuery, [userID], (err, results) => {
//                         if (err) return reject(err);
//                         resolve(results);
//                     });
//                 });

//                 let checkInFound = false;
//                 for (const result of checkInResults) {
//                     const savedDescriptor = JSON.parse(result.FaceDescriptor);

//                     // So sánh face descriptor đã lưu với face descriptor hiện tại
//                     const distance = faceapi.euclideanDistance(savedDescriptor, checkInDescriptor);
//                     if (distance < 0.6) { // Điều chỉnh ngưỡng khoảng cách khi cần
//                         // Chèn bản ghi check-in vào bảng attendance
//                         const sqlInsertAttendance =
//                             `INSERT INTO attendance(ID_User, timestamp, Status, Image, LateMinutes, EarlyLeaveMinutes, OvertimeMinutes)
//                         VALUES(?, ?, ?, ?, ?, ?, ?)`
//                             ;
//                         await new Promise((resolve, reject) => {
//                             db.query(sqlInsertAttendance, [userID, checkInTime, 'Check in', checkInImageBase64, lateMinutes, 0, 0], (err) => {
//                                 if (err) return reject(err);
//                                 console.log(`Check -in recorded for user ${userID} on ${checkInTime}`);
//                                 resolve();
//                             });
//                         });
//                         checkInFound = true;
//                         break;
//                     }
//                 }

//                 if (!checkInFound) {
//                     console.log(`No matching face descriptor found for check -in on ${checkInImgPath}`);
//                 }
//             } else {
//                 console.log(`No face detected in check -in image ${checkInImgPath}`);
//             }

//             // Load và xử lý ảnh cho check-out
//             const checkOutImgPath = path.join(attendanceSimulatorDir, randomFiles[1]);
//             const checkOutImg = await canvas.loadImage(checkOutImgPath);
//             const checkOutDetection = await faceapi.detectSingleFace(checkOutImg).withFaceLandmarks().withFaceDescriptor();

//             if (checkOutDetection) {
//                 const checkOutDescriptor = Array.from(checkOutDetection.descriptor); // Chuyển đổi Float32Array thành mảng thông thường
//                 const checkOutDescriptorJSON = JSON.stringify(checkOutDescriptor);

//                 // Đọc tệp ảnh và chuyển đổi thành base64
//                 const checkOutImageBuffer = await readFile(checkOutImgPath);
//                 const checkOutImageBase64 = `data: image/jpeg;base64,${checkOutImageBuffer.toString('base64')}`;

//                 // Truy vấn bảng userimage để tìm một bản khớp với face descriptor hiện tại
//                 const checkOutResults = await new Promise((resolve, reject) => {
//                     db.query(sqlQuery, [userID], (err, results) => {
//                         if (err) return reject(err);
//                         resolve(results);
//                     });
//                 });

//                 let checkOutFound = false;
//                 for (const result of checkOutResults) {
//                     const savedDescriptor = JSON.parse(result.FaceDescriptor);

//                     // So sánh face descriptor đã lưu với face descriptor hiện tại
//                     const distance = faceapi.euclideanDistance(savedDescriptor, checkOutDescriptor);
//                     if (distance < 0.6) { // Điều chỉnh ngưỡng khoảng cách khi cần
//                         // Chèn bản ghi check-out vào bảng attendance
//                         const sqlInsertAttendance =
//                             `INSERT INTO attendance (ID_User, timestamp, Status, Image, LateMinutes, EarlyLeaveMinutes, OvertimeMinutes) 
//                             VALUES (?, ?, ?, ?, ?, ?, ?)`
//                             ;
//                         await new Promise((resolve, reject) => {
//                             db.query(sqlInsertAttendance, [userID, checkOutTime, 'Check out', checkOutImageBase64, 0, earlyLeaveMinutes, overtimeMinutes], (err) => {
//                                 if (err) return reject(err);
//                                 console.log(`Check-out recorded for user ${userID} on ${checkOutTime}`);
//                                 resolve();
//                             });
//                         });
//                         checkOutFound = true;
//                         break;
//                     }
//                 }

//                 if (!checkOutFound) {
//                     console.log(`No matching face descriptor found for check - out on ${checkOutImgPath}`);
//                 }
//             } else {
//                 console.log(`No face detected in check-out image ${checkOutImgPath}`);
//             }
//         } catch (error) {
//             console.error(Error`processing files for ${currentDate.toLocaleDateString()}:`, error);
//         }
//     }
// }




// async function getUserIdAsync(folder) {
//     return new Promise((resolve, reject) => {
//         const sqlGetUserID = `SELECT ID FROM user WHERE FullName = ?`;
//         db.query(sqlGetUserID, [folder], (err, result) => {
//             if (err) {
//                 console.error(`Error getting user ID for ${folder}:`, err);
//                 reject(err);
//             } else {
//                 resolve(result[0].ID);
//             }
//         });
//     });
// }

// async function main() {
//     try {
//         await LoadModels();

//         const folders = await readdir(ORIGINAL_IMAGES_DIR);
//         for (const folder of folders) {
//             const folderPath = path.join(ORIGINAL_IMAGES_DIR, folder);
//             const userID = await getUserIdAsync(folder);

//             await getFeatureModel(folderPath, userID);
//             await simulateAttendance(folderPath, userID);
//         }
//     } catch (error) {
//         console.error("Error in main function:", error);
//     }
// }



// app.post('/getFeature_and_attendanceSimulator', async (req, res) => {
//     try {
//         await prepareData();
//         await main();
//         res.status(200).json({ message: "getFeature and evaluation completed" });
//     } catch (err) {
//         console.error("Error during getFeature and evaluation:", err);
//         res.status(500).json({ error: "Error during getFeature and evaluation" });
//     }
// });




























app.listen(8081, () => {
    console.log("Đang chạy trên cổng 8081");
});
