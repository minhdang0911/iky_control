const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            console.log('Verifying token:', token);
            console.log('Using secret:', process.env.JWT_SECRET);
            console.log('Decoded payload before verification:', jwt.decode(token));

            if (err) {
                console.error('Token verification error: ', err); // Log lỗi
                return res.status(401).json({
                    success: false,
                    mes: 'Invalid access token',
                });
            }
            req.user = decode; // Đảm bảo decode chứa thông tin người dùng
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Require authentication!!!',
        });
    }
});

const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user;
    if (+role !== 2001)
        return res.status(401).json({
            success: false,
            mes: 'REQUIRE ADMIN ROLE',
        });
    next();
});

module.exports = {
    verifyAccessToken,
    isAdmin,
};
