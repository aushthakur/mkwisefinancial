const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'New'
    },
    serviceType: {
        type: String,
        default: 'General Inquiry'
    },
    ghlSyncStatus: {
        type: String,
        default: 'Pending' // 'Success', 'Pending', 'Failed'
    },
    ghlRetryCount: {
        type: Number,
        default: 0
    },
    ghlError: {
        type: String
    },
    duplicateCount: {
        type: Number,
        default: 0
    },
    duplicateAttempts: [
        {
            timestamp: {
                type: Date,
                default: Date.now
            },
            source: String
        }
    ],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ContactLead', contactFormSchema);
