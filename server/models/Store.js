const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    technicians: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician',
        },
    ],
});

module.exports = mongoose.model('Store', storeSchema);
