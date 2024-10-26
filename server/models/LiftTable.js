const mongoose = require('mongoose');

// Model LiftTable (Bàn Nâng)
const liftTableSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('LiftTable', liftTableSchema);
