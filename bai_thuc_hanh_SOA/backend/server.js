const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors()); //Cho phép Frontend truy cập API
app.use(express.json());//Xử lý dữ liệu JSON từ Frontend

const SECRET_KEY = 'hai2000H'; 

let users = [
    {
        idUser : 1,
        username: 'admin',
        password: 'admin',
        token : null
    }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
         if(user) {
            return res.status(401).json({ message : 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        const payload = { idUser: user.idUser, username: user.username };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        user.token = token;
        res.json({ message: 'Đăng nhập thành công', token : token }); });
    const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if(authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, SECRET_KEY, (err, user) => {
                if(err) return res.status(403).json({ message: 'Token không hợp lệ' });
                req.user = user;
                next();
            });
        } else {
            res.status(401).json({ message: 'Token không được cung cấp' });
        }
    };

    app.get('/auth',authenticateToken, (req, res) => {
        res.json({ message: 'Xác thực thành công', user: req.user });
    });
    app.get('/hello', authenticateJWT, (req, res) => {
        res.send("xin chào");
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server đang chạy trên cổng ${PORT}`);
        });