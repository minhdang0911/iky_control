const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
});

module.exports = mongoose.model('Technician', technicianSchema);
