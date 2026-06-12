const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const nodemailer = require('nodemailer');
const ContactLead = require('../models/contactForm.model');
const fs = require('fs').promises;
const path = require('path');

/**
 * POST /api/webinar-register
 * Registers a lead for the 9 July 2026 First Home Webinar.
 * - Creates/updates contact in GHL with tags: Webinar-9July, FirstHome-Webinar
 * - Adds lead to Webinar Registration Pipeline
 * - Sends internal notification email
 * - Saves lead to MongoDB (with fallback to local file)
 */
router.post('/', async (req, res) => {
    console.log('📋 New Webinar Registration received...');

    const { firstName, email, phone, tags = [], source } = req.body;

    if (!firstName || !email || !phone) {
        return res.status(400).json({ error: 'firstName, email, and phone are required.' });
    }

    // ── 1. Create or Update Contact in GHL (V2 API) ───────────────────────────
    const ghlAccessToken = process.env.GHL_ACCESS_TOKEN || 'pit-9dfb9d81-a2a1-448a-ab4e-7cc36b670e7e';
    const locationId = '9XGJdS89KjPnK9P3CiMz';

    if (ghlAccessToken) {
        try {
            await axios.post(
                'https://services.leadconnectorhq.com/contacts/upsert',
                {
                    firstName,
                    email,
                    phone,
                    tags: ['Webinar-9July', 'FirstHome-Webinar', ...(tags || [])],
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
            console.log('✅ Lead created/updated in GHL via V2 API successfully.');
        } catch (ghlError) {
            console.error('❌ GHL API error:', ghlError.message);
            if (ghlError.response) {
                console.error('GHL response data:', JSON.stringify(ghlError.response.data));
            }
            // Non-blocking: continue even if GHL fails
        }
    } else {
        console.warn('⚠️  GHL_ACCESS_TOKEN not configured — skipping GHL push.');
    }

    // ── 2. Internal email notification (disabled — GHL handles communication) ──
    // Email sending removed: contacts are saved to GHL (which manages follow-up)
    // and to MongoDB. Re-enable below if direct email notification is needed.
    /*
    try {
        const transporter = nodemailer.createTransport({ ... });
        await transporter.sendMail({ ... });
    } catch (mailError) { ... }
    */

    // ── 3. Save to MongoDB / fallback file ───────────────────────────────────
    try {
        if (mongoose.connection.readyState === 1) {
            const lead = new ContactLead({
                name: firstName,
                email,
                phone,
                serviceType: 'Webinar Registration – 9 July 2026',
                message: `Webinar registration. Tags: Webinar-9July, FirstHome-Webinar.`,
                metadata: {
                    tags: ['Webinar-9July', 'FirstHome-Webinar'],
                    pipeline: 'Webinar Registration',
                    webinarDate: '9 July 2026',
                    source: source || 'Webinar Landing Page',
                },
            });
            await lead.save();
            console.log('✅ Lead saved to MongoDB.');
            return res.status(201).json({ message: 'Registered successfully.' });
        } else {
            // Fallback to local file
            const fallbackPath = path.join(__dirname, '../leads_fallback.json');
            const leadData = {
                firstName, email, phone,
                serviceType: 'Webinar Registration – 9 July 2026',
                tags: ['Webinar-9July', 'FirstHome-Webinar'],
                submittedAt: new Date().toISOString(),
                status: 'pending_sync',
            };
            let leads = [];
            try {
                const data = await fs.readFile(fallbackPath, 'utf8');
                leads = JSON.parse(data);
            } catch (_) {}
            leads.push(leadData);
            await fs.writeFile(fallbackPath, JSON.stringify(leads, null, 2));
            console.log('⚠️ MongoDB unavailable — lead saved to fallback file.');
            return res.status(201).json({ message: 'Registered successfully (fallback).' });
        }
    } catch (dbError) {
        console.error('❌ DB save error:', dbError.message);
        return res.status(500).json({ error: 'Registration received but failed to save. Please contact support.' });
    }
});

module.exports = router;
