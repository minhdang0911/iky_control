const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        cardNumber: { type: String, required: true },
        licensePlate: { type: String, required: true },
        repairStartTime: { type: Number, required: true },
        repairCompletionTime: { type: Number, default: null },
        user: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
        services: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
                name: { type: String },
                abbreviation: { type: String },
                time: { type: Number },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true },
);

customerSchema.methods.calculateRepairTime = function (inputTime) {
    if (inputTime !== undefined) {
        this.repairStartTime = inputTime;
    } else {
        this.repairStartTime = this.services.reduce((total, service) => total + service.time, 0);
    }
};

customerSchema.pre('save', function (next) {
    if (this.repairCompletionTime && this.repairCompletionTime < this.repairStartTime) {
        return next(new Error('Thời gian hoàn thành sửa chữa phải lớn hơn hoặc bằng thời gian bắt đầu sửa chữa.'));
    }
    next();
});

customerSchema.index({ storeId: 1, cardNumber: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
