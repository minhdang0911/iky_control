const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const jwt = require('jsonwebtoken');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(401); // Nếu không có token, trả về 401

    jwt.verify(token, (err, user) => {
        if (err) return res.sendStatus(403); // Nếu token không hợp lệ, trả về 403
        req.user = user; // Lưu thông tin người dùng vào req để sử dụng ở các middleware hoặc routes tiếp theo
        next(); // Tiếp tục đến middleware hoặc route tiếp theo
    });
};

// Sử dụng middleware trong các route cần xác thực
router.post('/create-technician', verifyAccessToken, technicianController.createTechnician);
router.get('/all-technicians', technicianController.getAllTechnical);
router.get('/technicians', technicianController.getTechniciansByStore);
router.delete('/technician/:id', verifyAccessToken, technicianController.deleteTechnician);
router.put('/technician/:id', verifyAccessToken, technicianController.updateTechnician);
// router.post('/create-technician', authenticateToken, technicianController.createTechnician);
// router.get('/technicians/:store', authenticateToken, technicianController.getTechniciansByStore);

module.exports = router;
