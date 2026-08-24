const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerName: {
        type: String,
        required: true,
        trim: true
    },
    referrerPhone: {
        type: String,
        default: '',
        trim: true
    },
    clientName: {
        type: String,
        default: 'General Client',
        trim: true
    },
    clientPhone: {
        type: String,
        default: '',
        trim: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'contacted', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Referral', referralSchema);
