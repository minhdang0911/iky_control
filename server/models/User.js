const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Không yêu cầu mật khẩu ngay lập tức
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    jwt: { type: String },
    isLoggedIn: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    resetPasswordCompleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
});

// userSchema.methods.generateAuthToken = function (payload) {
//     return jwt.sign(payload || { id: this._id }, 'secret_key', { expiresIn: '1h' });
// };

userSchema.methods.generateAuthToken = function (payload) {
    return jwt.sign(payload || { id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', userSchema);
