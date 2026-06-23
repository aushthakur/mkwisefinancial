const fs = require('fs').promises;
const path = require('path');
const Alert = require('../models/alert.model');
const mongoose = require('mongoose');

const LOG_FILE_PATH = path.join(__dirname, '../alerts.log');

/**
 * Logs a system alert to both local file storage and MongoDB (if online).
 * @param {string} type - Enum ['Mongo Failure', 'Fallback Failure', 'GHL Sync Failure', 'Missing GHL Contact', 'Duplicate Registration', 'Database Issue']
 * @param {string} message - Descriptive error message
 * @param {object} details - Error details or lead details
 */
async function logAlert(type, message, details = {}) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [ALERT: ${type}] - ${message} - Details: ${JSON.stringify(details)}\n`;

    // 1. Always append to local alerts.log file
    try {
        await fs.appendFile(LOG_FILE_PATH, logLine, 'utf8');
        console.log(`📝 Logged alert to local file: ${type}`);
    } catch (err) {
        console.error('❌ Failed to write to local alerts.log:', err.message);
    }

    // 2. Try to save to MongoDB
    try {
        if (mongoose.connection.readyState === 1) {
            const newAlert = new Alert({
                type,
                message,
                details
            });
            await newAlert.save();
            console.log(`✅ Saved alert to MongoDB: ${type}`);
        } else {
            console.warn(`⚠️ MongoDB unavailable. Alert skipped db insert: ${type}`);
        }
    } catch (dbErr) {
        console.error('❌ Database error while saving alert:', dbErr.message);
    }
}

/**
 * Runs a sanity check on the database and counts unsynced records.
 */
async function runSystemCheck() {
    console.log('🔍 Running system check...');
    
    // Check Mongo connection
    if (mongoose.connection.readyState !== 1) {
        await logAlert('Database Issue', 'MongoDB connection is down.', {
            readyState: mongoose.connection.readyState
        });
        return;
    }

    // Check GHL unsynced leads in Mongo
    try {
        const ContactLead = require('../models/contactForm.model');
        const pendingCount = await ContactLead.countDocuments({ ghlSyncStatus: 'Pending' });
        const failedCount = await ContactLead.countDocuments({ ghlSyncStatus: 'Failed' });

        if (failedCount > 0) {
            await logAlert('GHL Sync Failure', `There are ${failedCount} sync-failed leads in the database.`, {
                failedCount,
                pendingCount
            });
        }
    } catch (err) {
        console.error('❌ System check failed during database queries:', err.message);
    }

    // Check Fallback file readability
    const fallbackPath = path.join(__dirname, '../leads_fallback.json');
    try {
        const data = await fs.readFile(fallbackPath, 'utf8');
        const leads = JSON.parse(data);
        const pendingMongo = leads.filter(l => l.mongoSyncStatus === 'Pending').length;
        if (pendingMongo > 0) {
            await logAlert('Mongo Failure', `There are ${pendingMongo} registration leads stuck in the local fallback file.`, {
                pendingMongo,
                totalFallback: leads.length
            });
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            await logAlert('Fallback Failure', 'Could not read or parse fallback file leads_fallback.json.', {
                error: err.message
            });
        }
    }
}

module.exports = {
    logAlert,
    runSystemCheck
};
