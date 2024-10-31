const User = require('../models/User');
const Technician = require('../models/Technician');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

// Kiểm tra email đăng ký

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const isEmailRegistered = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
};

// Đăng ký người dùng
// exports.register = async (req, res) => {
//     const { firstName, lastName, phoneNumber, address, email, password } = req.body;

//     try {
//         if (await isEmailRegistered(email)) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'Email đã được đăng ký',
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ firstName, lastName, phoneNumber, address, email, password: hashedPassword });

//         await user.save();

//         const token = crypto.randomBytes(16).toString('hex');

//         return res.status(201).json({
//             status: 201,
//             success: true,
//             mes: 'Đăng ký thành công!',
//             token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Có lỗi xảy ra khi tạo người dùng.');
//     }
// };

// // Đăng nhập người dùng
// exports.login = async (req, res) => {
//     const { email, password, storeId } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).send('Tài khoản hoặc mật khẩu không đúng.');
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).send('Email hoặc mật khẩu không đúng.');
//         }

//         // Cập nhật storeId vào người dùng và đặt isLoggedIn thành true
//         user.storeId = storeId;
//         user.isLoggedIn = true;
//         await user.save();

//         const token = user.generateAuthToken();

//         const technicians = await Technician.find({ store: storeId });

//         res.send({
//             message: 'Đăng nhập thành công!',
//             token,
//             user: {
//                 fullName: `${user.firstName} ${user.lastName}`,
//                 phoneNumber: user.phoneNumber,
//                 address: user.address,
//                 email: user.email,
//                 isLoggedIn: user.isLoggedIn, // Trả về trạng thái đăng nhập
//             },
//             technicians,
//         });
//     } catch (error) {
//         console.error('Lỗi khi đăng nhập:', error);
//         res.status(500).send('Có lỗi xảy ra trong quá trình đăng nhập.');
//     }
// };

//code đăng ký người dùng sms bị lỗi ko gui ve sđt viet nam
// const client = twilio(accountSid, authToken);

// const formatPhoneNumber = (phoneNumber) => {
//     // Kiểm tra xem số điện thoại có bắt đầu bằng '+' không
//     if (!phoneNumber.startsWith('+')) {
//         throw new Error('Số điện thoại không hợp lệ');
//     }

//     // Chỉ định lại biến cleaned để loại bỏ tất cả ký tự không phải số
//     const cleaned = ('' + phoneNumber).replace(/\D/g, '');

//     // Kiểm tra độ dài số điện thoại sau khi đã loại bỏ ký tự không phải số
//     if (cleaned.length < 10) {
//         throw new Error('Số điện thoại không hợp lệ');
//     }

//     return `+${cleaned}`; // Trả về số điện thoại đã được định dạng
// };

// const sendSmsVerification = async (phoneNumber, verificationCode) => {
//     const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
//     console.log('Đang gửi tin nhắn tới:', formattedPhoneNumber);
//     try {
//         await client.messages.create({
//             body: `Mã xác thực của bạn là: ${verificationCode}`,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: formattedPhoneNumber,
//         });
//         console.log('Tin nhắn đã được gửi thành công');
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi gửi SMS:', error);
//         throw new Error('Gửi SMS không thành công');
//     }
// };

// const generateVerificationCode = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã 6 chữ số
// };

// const pendingUsers = {};

// exports.register = async (req, res) => {
//     const { firstName, lastName, phoneNumber, address, email, password } = req.body;

//     try {
//         // Kiểm tra email và số điện thoại đã tồn tại
//         if (await isEmailRegistered(email)) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'Email đã được đăng ký',
//             });
//         }

//         if (await isPhoneNumberRegistered(phoneNumber)) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'Số điện thoại đã được đăng ký',
//             });
//         }

//         // Tạo mã xác thực
//         const verificationCode = generateVerificationCode();
//         console.log('Mã xác thực:', verificationCode); // Kiểm tra mã xác thực

//         // Gửi SMS
//         await sendSmsVerification(phoneNumber, verificationCode);

//         // Lưu thông tin người dùng vào đối tượng tạm thời
//         pendingUsers[phoneNumber] = {
//             firstName,
//             lastName,
//             phoneNumber,
//             address,
//             email,
//             password: await bcrypt.hash(password, 10), // Mã hóa mật khẩu
//             verificationCode,
//         };

//         return res.status(201).json({
//             status: 201,
//             success: true,
//             mes: 'Đăng ký thành công! Vui lòng kiểm tra số điện thoại của bạn để xác thực.',
//         });
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi tạo người dùng:', error);
//         res.status(500).send('Có lỗi xảy ra khi tạo người dùng.');
//     }
// };

// exports.verifyPhoneNumber = async (req, res) => {
//     const { phoneNumber, verificationCode } = req.body;

//     console.log('phoneNumber', phoneNumber);
//     console.log('verificationCode', verificationCode);

//     try {
//         const pendingUser = pendingUsers[phoneNumber]; // Lấy thông tin người dùng chưa xác thực
//         if (!pendingUser) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'Số điện thoại không tồn tại hoặc chưa được gửi mã xác thực.',
//             });
//         }

//         if (pendingUser.verificationCode !== verificationCode) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'Mã xác thực không đúng.',
//             });
//         }

//         const user = new User({
//             firstName: pendingUser.firstName,
//             lastName: pendingUser.lastName,
//             phoneNumber: pendingUser.phoneNumber,
//             address: pendingUser.address,
//             email: pendingUser.email,
//             password: pendingUser.password,
//             isVerified: true, // Đánh dấu là đã xác thực
//         });

//         await user.save(); // Lưu vào cơ sở dữ liệu
//         delete pendingUsers[phoneNumber]; // Xóa thông tin người dùng khỏi đối tượng tạm

//         return res.status(200).json({
//             status: 200,
//             success: true,
//             mes: 'Xác thực thành công!',
//         });
//     } catch (error) {
//         console.error('Có lỗi xảy ra khi xác thực:', error);
//         res.status(500).send('Có lỗi xảy ra khi xác thực.');
//     }
// };
//end code đăng ký sđt viert nam

// Đăng ký người dùng
const isPhoneNumberRegistered = async (phoneNumber) => {
    const user = await User.findOne({ phoneNumber });
    return !!user; // Trả về true nếu số điện thoại đã được đăng ký
};

const sendVerificationEmail = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Xác Thực</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                p {
                    color: #555;
                }
                .verification-code {
                    color: #2E8B57;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 20px;
                    border-top: 1px solid #2E8B57;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://theme.hstatic.net/200000863565/1001224143/14/logo.png?v=21" alt="Logo Công Ty" style="max-width: 200px;">
                <h2>Công ty Cổ phần Công nghệ Tiện ích Thông minh</h2>
                <p>Xin chào,</p>
                <p>Mã xác thực của bạn là: <span class="verification-code">${verificationCode}</span></p>
                <p>Vui lòng nhập mã này để hoàn tất quá trình đăng ký tài khoản của bạn.</p>
                <div class="footer">
                    <p>Hành Chính Nhân Sự</p>
                    <p>Địa điểm văn phòng: 38-40 Đường Số 21A, Phường Bình Trị Đông B, Quận Bình Tân, Tp. HCM</p>
                    <p><a href="http://www.iky.vn" style="color: #2E8B57; text-decoration: none;">www.iky.vn</a></p>
                    <p>Mobile: 0368963354</p>
                    <p>Skype: iky.hcns@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: '"IKY COMPANY" <no-relply@TMDShop.com>',
        to: email,
        subject: 'Mã xác thực đăng ký tài khoản',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

exports.register = async (req, res) => {
    const { firstName, lastName, phoneNumber, address, email, password } = req.body;

    try {
        if (await isEmailRegistered(email)) {
            return res.status(400).json({
                status: 400,
                success: false,
                mes: 'Email đã được đăng ký',
            });
        }

        if (await isPhoneNumberRegistered(phoneNumber)) {
            return res.status(400).json({
                status: 401,
                success: false,
                mes: 'Số điện thoại đã được đăng ký',
            });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng với mật khẩu đã được hash
        const user = new User({
            firstName,
            lastName,
            phoneNumber,
            address,
            email,
            password: hashedPassword, // Lưu mật khẩu đã được hash
            verificationCode,
            isVerified: false,
        });

        await user.save();

        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
            status: 200,
            success: true,
            mes: 'Mã xác thực đã được gửi tới email của bạn.',
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi đăng ký:', error);
        res.status(500).send('Có lỗi xảy ra khi đăng ký.');
    }
};

exports.verifyCode = async (req, res) => {
    const { email, verificationCode, password } = req.body;
    console.log('Yêu cầu đã đến verifyCode:', req.body);
    try {
        const user = await User.findOne({ email });
        console.log('email', user);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Email không tồn tại.' });
        }

        // Kiểm tra mã xác thực
        if (user.verificationCode !== verificationCode) {
            await User.deleteOne({ email });
            return res.status(400).json({ success: false, message: 'Mã xác thực không đúng. Tài khoản đã bị xóa.' });
        }

        // Kiểm tra mật khẩu
        if (!password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không được để trống.' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword; // Lưu mật khẩu đã được hash
        user.isVerified = true; // Đánh dấu đã xác thực
        user.verificationCode = null; // Xóa mã xác thực

        await user.save();

        const token = user.generateAuthToken();
        user.jwt = token; // Lưu token vào trường jwt

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            email: user.email,
            isLoggedIn: user.isLoggedIn,
        };

        return res.status(201).json({
            status: 201,
            success: true,
            mes: 'Đăng ký thành công!',
            token,
            user: userResponse,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi xác thực mã:', error);
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xác thực mã.' });
    }
};

exports.login = async (req, res) => {
    const { email, password, storeId } = req.body;

    try {
        // Tìm người dùng qua email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng.' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Cập nhật thông tin đăng nhập
        user.storeId = storeId;
        user.isLoggedIn = true;
        await user.save();

        // Tạo JWT token
        const token = user.generateAuthToken({
            storeId: user.storeId,
            role: user.role,
            id: user._id,
        });

        // Tìm danh sách kỹ thuật viên theo storeId
        const technicians = await Technician.find({ store: storeId });

        // Chỉ trả về các thông tin cần thiết, không bao gồm mật khẩu
        const userResponse = {
            _id: user._id,
            fullName: `${user.firstName} ${user.lastName}`,
            phoneNumber: user.phoneNumber,
            address: user.address,
            email: user.email,
            isLoggedIn: user.isLoggedIn,
            storeId: user.storeId,
        };

        // Trả về phản hồi JSON
        return res.status(201).json({
            message: 'Đăng nhập thành công!',
            token,
            user: userResponse,
            technicians,
            status: '201',
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi đăng nhập:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng nhập.' });
    }
};

exports.logout = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Lấy token từ header

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Thay 'secret_key' bằng khóa bí mật của bạn
        const userId = decoded.id; // Lấy _id từ token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        // Đặt isLoggedIn thành false
        user.isLoggedIn = false;
        await user.save();

        res.json({ success: true, message: 'Đăng xuất thành công!' });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình đăng xuất.' });
    }
};

// exports.getUserById = async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'secret_key'); // Thay 'secret_key' bằng khóa bí mật của bạn
//         const userId = decoded.id; // Lấy _id từ token

//         const user = await User.findById(userId).select('-jwt -password');
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Người dùng không tồn tại',
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             rs: user,
//         });
//     } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu người dùng:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Lỗi server nội bộ',
//         });
//     }
// };

exports.getUserById = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        const userId = decoded.id; // Extract user ID from token

        // Chỉ chọn các trường cần thiết: _id, firstName, lastName, email, isLoggedIn, storeId
        const user = await User.findById(userId).select('_id firstName lastName email isLoggedIn storeId');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại',
            });
        }

        return res.status(200).json({
            success: true,
            rs: user,
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(402).json({
                status: '402',
                success: false,
                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
            });
        } else {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ',
            });
        }
    }
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu hoặc mật khẩu ứng dụng
    },
});

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email không tồn tại.' });
        }

        // Tạo token reset mật khẩu
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token có hiệu lực trong 10 phút

        await user.save();

        // Tạo URL để đặt lại mật khẩu
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Cấu hình để gửi email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Yêu cầu đặt lại mật khẩu</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        background-color: #fff;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #555;
                    }
                    a {
                        color: #2E8B57;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 20px;
                        border-top: 1px solid #2E8B57;
                        padding-top: 10px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <p>Vui lòng nhấn vào liên kết dưới đây để đặt lại mật khẩu của bạn:</p>
                    <p><a href="${resetUrl}">Đặt lại mật khẩu</a></p>
                    <div class="footer">
                        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.</p>
                        <p>Chân thành cảm ơn,</p>
                        <p>Đội ngũ hỗ trợ của Công ty Cổ phần Công nghệ Tiện ích Thông minh</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: '"IKY COMPANY" <no-relply@TMDShop.com>',
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email đặt lại mật khẩu đã được gửi.', status: 200 });
    } catch (error) {
        console.error('Lỗi khi gửi email quên mật khẩu:', error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi gửi email.' });
    }
};
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    console.log('Token nhận được:', token);
    console.log('Mật khẩu mới:', newPassword);
    console.log('Xác nhận mật khẩu mới:', confirmNewPassword);

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log('Token đã băm:', hashedToken);

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            console.log('Không tìm thấy người dùng với token này.');
            return res
                .status(400)
                .json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.', status: 400 });
        }

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
        if (newPassword !== confirmNewPassword) {
            console.log('Mật khẩu và xác nhận mật khẩu không trùng khớp.');
            return res.status(400).json({ success: false, message: 'Mật khẩu và xác nhận mật khẩu không trùng khớp.' });
        }

        // Kiểm tra xem mật khẩu mới có ít nhất 6 ký tự không
        if (!newPassword || newPassword.length < 6) {
            console.log('Mật khẩu mới không hợp lệ, chiều dài không đủ.');
            return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        // Cập nhật mật khẩu
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Xóa token
        user.resetPasswordExpire = undefined; // Xóa thời gian hết hạn

        await user.save();

        console.log('Đặt lại mật khẩu thành công cho người dùng:', user._id);
        res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công!', status: 200 });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error.message);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi đặt lại mật khẩu.' });
    }
};

const generateVerificationCode = () => {
    return crypto.randomBytes(3).toString('hex'); // Tạo mã gồm 6 ký tự ngẫu nhiên
};

// Gửi email chứa mã xác thực
const sendVerificationEmailChangePassword = async (email, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Thời gian hiệu lực của mã xác thực
    const expirationTime = 10; // phút
    const expirationSeconds = expirationTime * 60; // giây

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã xác thực đổi mật khẩu</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                p {
                    color: #555;
                }
                .verification-code {
                    color: #2E8B57;
                    font-weight: bold;
                    font-size: 20px;
                }
                .footer {
                    margin-top: 20px;
                    border-top: 1px solid #2E8B57;
                    padding-top: 10px;
                    font-size: 12px;
                    color: #777;
                }
                .countdown {
                    color: #d9534f;
                    font-weight: bold;
                    font-size: 18px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://theme.hstatic.net/200000863565/1001224143/14/logo.png?v=21" alt="Logo Công Ty" style="max-width: 200px;">
                <h2>Công ty Cổ phần Công nghệ Tiện ích Thông minh</h2>
                <p>Xin chào,</p>
                <p>Mã xác thực của bạn là: <span class="verification-code">${verificationCode}</span></p>
                <p>Vui lòng nhập mã này để hoàn tất quá trình đổi mật khẩu của bạn.</p>
                <p class="countdown">Mã xác thực có hiệu lực trong ${expirationTime} phút. Vui lòng nhập mã trước khi hết thời gian!</p>
                <div class="footer">
                    <p>Địa điểm văn phòng: 38-40 Đường Số 21A, Phường Bình Trị Đông B, Quận Bình Tân, Tp. HCM</p>
                    <p><a href="http://www.iky.vn" style="color: #2E8B57; text-decoration: none;">www.iky.vn</a></p>
                    <p>Mobile: 0368963354</p>
                    <p>Skype: iky.hcns@gmail.com</p>
                    <p>Thanks & Best regards,</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: '"Công ty Cổ phần Công nghệ Tiện ích Thông minh" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Mã xác thực đổi mật khẩu',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

// Tính năng yêu cầu đổi mật khẩu
exports.requestChangePassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        // Tạo mã xác thực và thời gian hết hạn
        const verificationCode = generateVerificationCode();
        const expireTime = Date.now() + 10 * 60 * 1000; // Mã hết hạn sau 10 phút

        // Lưu mã xác thực và thời gian hết hạn vào cơ sở dữ liệu
        user.verificationCode = verificationCode;
        user.resetPasswordExpire = expireTime;
        await user.save();

        // Gửi email xác thực
        await sendVerificationEmailChangePassword(email, verificationCode);

        return res.status(200).json({
            success: true,
            message: 'Mã xác thực đã được gửi tới email của bạn.',
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi yêu cầu đổi mật khẩu:', error);
        res.status(500).send('Có lỗi xảy ra khi yêu cầu đổi mật khẩu.');
    }
};

// Tính năng đổi mật khẩu
exports.changePassword = async (req, res) => {
    const { email, oldPassword, newPassword, verificationCode } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        // Kiểm tra mã xác thực
        if (user.verificationCode !== verificationCode || user.resetPasswordExpire < Date.now()) {
            return res
                .status(400)
                .json({ success: false, message: 'Mã xác thực không đúng hoặc đã hết hạn.', status: 400 });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Mật khẩu cũ không đúng.', status: 400 });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // Lưu mật khẩu mới đã được hash

        // Xóa mã xác thực và thời gian hết hạn
        user.verificationCode = null;
        user.resetPasswordExpire = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Đổi mật khẩu thành công!',
            status: 200,
        });
    } catch (error) {
        console.error('Có lỗi xảy ra khi đổi mật khẩu:', error);
        res.status(500).send('Có lỗi xảy ra khi đổi mật khẩu.');
    }
};
