const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const ContactLead = require('../models/contactForm.model');
const Alert = require('../models/alert.model');
const { logAlert } = require('../services/leadMonitor');

const FALLBACK_PATH = path.join(__dirname, '../leads_fallback.json');
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'mkwise_webinar_secret_key_12345';
const ADMIN_EMAIL = 'admin@mkwisefinancial.com';
const ADMIN_PASSWORD = 'admin1234';

// ── CRYPTO TOKEN HELPERS ─────────────────────────────────────────────────────

function generateWelcomeToken(email) {
    const data = JSON.stringify({ email, expiresAt: Date.now() + 30 * 60 * 1000 }); // 30 mins
    const key = crypto.scryptSync(TOKEN_SECRET, 'salt', 32);
    const iv = Buffer.alloc(16, 0); // Static IV for simplicity
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function verifyWelcomeToken(token) {
    try {
        const key = crypto.scryptSync(TOKEN_SECRET, 'salt', 32);
        const iv = Buffer.alloc(16, 0);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(token, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        const parsed = JSON.parse(decrypted);
        if (parsed.expiresAt < Date.now()) {
            return { valid: false, error: 'Token expired' };
        }
        return { valid: true, email: parsed.email };
    } catch (err) {
        return { valid: false, error: 'Invalid token signature' };
    }
}

// ── ADMIN PROTECTION MIDDLEWARE ──────────────────────────────────────────────

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Basic ${Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString('base64')}`) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// ── ENDPOINTS ────────────────────────────────────────────────────────────────

/**
 * POST /api/webinar-register/check-duplicate
 * Checks if email or phone is already registered for the webinar.
 */
router.post('/check-duplicate', async (req, res) => {
    const { email, phone } = req.body;
    if (!email && !phone) {
        return res.status(400).json({ error: 'Email or phone number is required.' });
    }

    try {
        const query = {
            serviceType: 'Webinar Registration – 9 July 2026',
            $or: []
        };
        if (email) query.$or.push({ email });
        if (phone) query.$or.push({ phone });

        let isDuplicate = false;
        
        if (mongoose.connection.readyState === 1) {
            const existing = await ContactLead.findOne(query);
            if (existing) isDuplicate = true;
        } else {
            // Check fallback file as backup
            try {
                const data = await fs.readFile(FALLBACK_PATH, 'utf8');
                const leads = JSON.parse(data);
                const match = leads.find(l => 
                    l.serviceType === 'Webinar Registration – 9 July 2026' && 
                    ((email && l.email === email) || (phone && l.phone === phone))
                );
                if (match) isDuplicate = true;
            } catch (_) {}
        }

        res.json({ isDuplicate });
    } catch (err) {
        console.error('❌ Check duplicate error:', err.message);
        res.status(500).json({ error: 'Failed to query existing registrations.' });
    }
});

/**
 * POST /api/webinar-register/verify-token
 * Verifies welcome token validity.
 */
router.post('/verify-token', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ valid: false, error: 'Token is required' });
    }
    const result = verifyWelcomeToken(token);
    res.json(result);
});

/**
 * POST /api/webinar-register
 * Registers a lead for the First Home Webinar.
 * Saves to GHL, MongoDB, and Fallback File synchronously.
 */
router.post('/', async (req, res) => {
    const { firstName, email, phone, tags = [], source, isDuplicateConfirmed } = req.body;

    if (!firstName || !email || !phone) {
        return res.status(400).json({ error: 'firstName, email, and phone are required.' });
    }

    const webinarService = 'Webinar Registration – 9 July 2026';
    const webinarTags = ['Webinar-9July', 'FirstHome-Webinar', ...(tags || [])];

    // Check duplicate check on backend in case bypass
    if (!isDuplicateConfirmed) {
        try {
            const query = {
                serviceType: webinarService,
                $or: []
            };
            if (email) query.$or.push({ email });
            if (phone) query.$or.push({ phone });

            let existing = null;
            if (mongoose.connection.readyState === 1) {
                existing = await ContactLead.findOne(query);
            } else {
                try {
                    const data = await fs.readFile(FALLBACK_PATH, 'utf8');
                    const leads = JSON.parse(data);
                    existing = leads.find(l => 
                        l.serviceType === webinarService && 
                        ((email && l.email === email) || (phone && l.phone === phone))
                    );
                } catch (_) {}
            }

            if (existing) {
                return res.status(200).json({ isDuplicate: true, message: 'Already registered.' });
            }
        } catch (_) {}
    }

    let leadData = {
        name: firstName,
        email,
        phone,
        serviceType: webinarService,
        message: `Webinar registration. Tags: ${webinarTags.join(', ')}.`,
        metadata: {
            tags: webinarTags,
            pipeline: 'Webinar Registration',
            webinarDate: '9 July 2026',
            source: source || 'Webinar Landing Page',
        },
        ghlSyncStatus: 'Pending',
        ghlRetryCount: 0,
        ghlError: '',
        duplicateCount: 0,
        duplicateAttempts: []
    };

    // ── Update duplicate attempt data if confirmed duplicate ─────────────────
    if (isDuplicateConfirmed) {
        try {
            let existing = null;
            if (mongoose.connection.readyState === 1) {
                existing = await ContactLead.findOne({
                    serviceType: webinarService,
                    $or: [{ email }, { phone }]
                });
            } else {
                try {
                    const data = await fs.readFile(FALLBACK_PATH, 'utf8');
                    const leads = JSON.parse(data);
                    existing = leads.find(l => 
                        l.serviceType === webinarService && 
                        (l.email === email || l.phone === phone)
                    );
                } catch (_) {}
            }

            if (existing) {
                leadData.duplicateCount = (existing.duplicateCount || 0) + 1;
                leadData.duplicateAttempts = [...(existing.duplicateAttempts || [])];
                leadData.duplicateAttempts.push({
                    timestamp: new Date(),
                    source: source || 'Webinar Landing Page'
                });
                // Log alert
                await logAlert(
                    'Duplicate Registration',
                    `User ${firstName} (${email}) attempted a duplicate registration.`,
                    {
                        name: firstName,
                        email,
                        phone,
                        attemptCount: leadData.duplicateCount,
                        source
                    }
                );
            }
        } catch (err) {
            console.error('Error computing duplicate metadata:', err.message);
        }
    }

    // ── 1. GHL SAVE OPERATION ────────────────────────────────────────────────
    const ghlAccessToken = process.env.GHL_ACCESS_TOKEN || 'pit-9dfb9d81-a2a1-448a-ab4e-7cc36b670e7e';
    const locationId = '9XGJdS89KjPnK9P3CiMz';

    let ghlStatus = 'Pending';
    let ghlErrorMsg = '';

    if (ghlAccessToken) {
        try {
            const upsertResponse = await axios.post(
                'https://services.leadconnectorhq.com/contacts/upsert',
                {
                    firstName,
                    email,
                    phone,
                    tags: webinarTags,
                    locationId: locationId,
                    source: source || 'Webinar Landing Page – 9 July 2026',
                },
                {
                    headers: {
                        'Authorization': `Bearer ${ghlAccessToken}`,
                        'Version': '2021-07-28',
                        'Content-Type': 'application/json'
                    }
                }
            );

            const contactId = upsertResponse?.data?.contact?.id;

            if (contactId) {
                try {
                    await axios.post(
                        `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
                        { tags: webinarTags },
                        {
                            headers: {
                                'Authorization': `Bearer ${ghlAccessToken}`,
                                'Version': '2021-07-28',
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } catch (tagErr) {
                    console.warn('⚠️ Tag application failed on GHL contact:', tagErr.message);
                }
            }
            ghlStatus = 'Success';
            console.log('✅ Synchronous GHL registration push complete.');
        } catch (ghlError) {
            console.error('❌ Synchronous GHL push failed:', ghlError.message);
            ghlStatus = 'Failed';
            ghlErrorMsg = ghlError.message;
            // Notify System Monitor
            await logAlert(
                'GHL Sync Failure',
                `Initial GHL sync failed for registration: ${email}. Queued for retry.`,
                { name: firstName, email, phone, error: ghlError.message }
            );
        }
    } else {
        console.warn('⚠️ GHL Access Token missing - GHL set to Pending.');
    }

    leadData.ghlSyncStatus = ghlStatus;
    leadData.ghlError = ghlErrorMsg;

    // ── 2. MONGO DB SAVE OPERATION ───────────────────────────────────────────
    let mongoStatus = 'Pending';
    if (mongoose.connection.readyState === 1) {
        try {
            let record = await ContactLead.findOne({
                serviceType: webinarService,
                $or: [{ email }, { phone }]
            });

            if (record) {
                // Update existing record (for duplicate confirmation update)
                record.name = firstName;
                record.email = email;
                record.phone = phone;
                record.ghlSyncStatus = ghlStatus;
                record.ghlError = ghlErrorMsg;
                record.duplicateCount = leadData.duplicateCount;
                record.duplicateAttempts = leadData.duplicateAttempts;
                record.metadata = { ...record.metadata, ...leadData.metadata };
                await record.save();
                console.log('✅ Lead updated in MongoDB.');
            } else {
                // Insert new record
                const lead = new ContactLead({
                    name: firstName,
                    email,
                    phone,
                    serviceType: webinarService,
                    message: leadData.message,
                    ghlSyncStatus: leadData.ghlSyncStatus,
                    ghlError: leadData.ghlError,
                    duplicateCount: leadData.duplicateCount,
                    duplicateAttempts: leadData.duplicateAttempts,
                    metadata: leadData.metadata
                });
                await lead.save();
                console.log('✅ Lead saved to MongoDB.');
            }
            mongoStatus = 'Success';
        } catch (dbErr) {
            console.error('❌ MongoDB save failed:', dbErr.message);
            await logAlert(
                'Mongo Failure',
                `Failed to write webinar registration for ${email} to MongoDB.`,
                { name: firstName, email, phone, error: dbErr.message }
            );
        }
    } else {
        console.warn('⚠️ MongoDB connection inactive - Mongo set to Pending.');
        await logAlert(
            'Database Issue',
            `MongoDB is down during registration submission for ${email}.`,
            { name: firstName, email }
        );
    }

    // ── 3. FALLBACK FILE SAVE OPERATION ──────────────────────────────────────
    let fallbackStatus = 'Pending';
    try {
        let fallbackLeads = [];
        try {
            const data = await fs.readFile(FALLBACK_PATH, 'utf8');
            fallbackLeads = JSON.parse(data);
        } catch (_) {}

        // Remove existing fallback record if duplicate attempt to update it
        fallbackLeads = fallbackLeads.filter(l => 
            !(l.serviceType === webinarService && (l.email === email || l.phone === phone))
        );

        fallbackLeads.push({
            name: firstName,
            email,
            phone,
            serviceType: webinarService,
            submittedAt: new Date().toISOString(),
            mongoSyncStatus: mongoStatus,
            ghlSyncStatus: ghlStatus,
            ghlRetryCount: leadData.ghlRetryCount,
            ghlError: leadData.ghlError,
            duplicateCount: leadData.duplicateCount,
            duplicateAttempts: leadData.duplicateAttempts,
            metadata: leadData.metadata
        });

        await fs.writeFile(FALLBACK_PATH, JSON.stringify(fallbackLeads, null, 2));
        fallbackStatus = 'Success';
        console.log('✅ Lead logged to fallback file.');
    } catch (fbErr) {
        console.error('❌ Fallback write failed:', fbErr.message);
        await logAlert(
            'Fallback Failure',
            `Could not append registration for ${email} to leads_fallback.json.`,
            { error: fbErr.message }
        );
    }

    // Secure token generation
    const token = generateWelcomeToken(email);

    res.status(201).json({
        success: true,
        token,
        ghlSyncStatus: ghlStatus,
        mongoSyncStatus: mongoStatus,
        fallbackSyncStatus: fallbackStatus
    });
});

// ── ADMIN DATA ENDPOINTS ─────────────────────────────────────────────────────

/**
 * GET /api/webinar-register/admin/all
 * Categorized listing of webinar leads for Webinar Panel.
 */
router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        let leads = [];
        
        if (mongoose.connection.readyState === 1) {
            leads = await ContactLead.find({ serviceType: 'Webinar Registration – 9 July 2026' }).sort({ createdAt: -1 });
        } else {
            // Load fallback file if DB is down
            try {
                const data = await fs.readFile(FALLBACK_PATH, 'utf8');
                leads = JSON.parse(data).filter(l => l.serviceType === 'Webinar Registration – 9 July 2026');
                // Map fields to mock MongoDB structure
                leads = leads.map((l, i) => ({
                    _id: `fallback-${i}`,
                    name: l.name,
                    email: l.email,
                    phone: l.phone,
                    createdAt: l.submittedAt || new Date(),
                    serviceType: l.serviceType,
                    ghlSyncStatus: l.ghlSyncStatus,
                    ghlRetryCount: l.ghlRetryCount || 0,
                    ghlError: l.ghlError || '',
                    duplicateCount: l.duplicateCount || 0,
                    duplicateAttempts: l.duplicateAttempts || [],
                    metadata: l.metadata || {}
                }));
            } catch (_) {}
        }

        // Categorize lists
        const registrations = leads;
        const pendingGhl = leads.filter(l => l.ghlSyncStatus === 'Pending' || l.ghlSyncStatus === 'Failed');
        const failedRegistrations = leads.filter(l => l.ghlSyncStatus === 'Failed');
        const duplicateRegistrations = leads.filter(l => l.duplicateCount > 0);

        res.json({
            registrations,
            pendingGhl,
            failedRegistrations,
            duplicateRegistrations
        });
    } catch (err) {
        console.error('Error fetching admin webinar data:', err.message);
        res.status(500).json({ error: 'Failed to retrieve registrations.' });
    }
});

/**
 * GET /api/webinar-register/admin/alerts
 * Lists unresolved and resolved system alerts.
 */
router.get('/admin/alerts', adminAuth, async (req, res) => {
    try {
        let alerts = [];
        if (mongoose.connection.readyState === 1) {
            alerts = await Alert.find().sort({ createdAt: -1 });
        } else {
            // Return connection offline mock alert plus fallback log read
            alerts = [
                {
                    _id: 'db-offline-alert',
                    type: 'Database Issue',
                    message: 'MongoDB Connection is offline.',
                    resolved: false,
                    createdAt: new Date()
                }
            ];
            // Try to read local log
            try {
                const LOG_FILE_PATH = path.join(__dirname, '../alerts.log');
                const logData = await fs.readFile(LOG_FILE_PATH, 'utf8');
                const lines = logData.trim().split('\n').reverse().slice(0, 30);
                lines.forEach((line, idx) => {
                    alerts.push({
                        _id: `log-alert-${idx}`,
                        type: 'Fallback Failure',
                        message: line,
                        resolved: false,
                        createdAt: new Date()
                    });
                });
            } catch (_) {}
        }
        res.json(alerts);
    } catch (err) {
        console.error('Error fetching alerts:', err.message);
        res.status(500).json({ error: 'Failed to retrieve system alerts.' });
    }
});

/**
 * POST /api/webinar-register/admin/alerts/resolve
 * Resolves a system alert.
 */
router.post('/admin/alerts/resolve', adminAuth, async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Alert ID is required.' });
    }

    try {
        if (mongoose.connection.readyState === 1) {
            await Alert.findByIdAndUpdate(id, { resolved: true });
            res.json({ success: true, message: 'Alert resolved.' });
        } else {
            res.status(503).json({ error: 'Database is offline, cannot resolve alert right now.' });
        }
    } catch (err) {
        console.error('Error resolving alert:', err.message);
        res.status(500).json({ error: 'Failed to resolve alert.' });
    }
});

module.exports = router;
