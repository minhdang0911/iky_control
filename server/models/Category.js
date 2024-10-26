const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    abbreviation: { type: String, required: true },
    time: { type: Number, required: true }, // Đảm bảo trường time có kiểu Number
    createdAt: { type: Date, default: Date.now }, // Trường tạo thời gian, nếu cần
});

module.exports = mongoose.model('Category', categorySchema);
