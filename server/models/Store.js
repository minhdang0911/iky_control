// const mongoose = require('mongoose');

// const storeSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     technicians: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Technician',
//         },
//     ],
// });

//
const mongoose = require('mongoose');

// Định nghĩa mô hình cho Store
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    ward: {
        type: String,
    },
    technicians: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician', // Tham chiếu đến mô hình Technician
        },
    ],
    changeHistory: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Tham chiếu đến mô hình User
                required: true,
            },
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            changes: {
                type: String,
                required: true,
            },
        },
    ],
});

// Xuất mô hình Store
module.exports = mongoose.model('Store', storeSchema);
