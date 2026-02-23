const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ContactLead = require('../models/contactForm.model');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message, serviceType } = req.body;

        // Forward to GoHighLevel if configured
        const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
        console.log('Checking GHL Webhook configuration:', ghlWebhookUrl ? 'Configured' : 'Not Configured');

        if (ghlWebhookUrl && ghlWebhookUrl !== 'your_ghl_webhook_url_here') {
            try {
                // Parse name into first/last name for GHL
                const nameParts = name.trim().split(/\s+/);
                const firstName = nameParts[0] || '';
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                console.log('Forwarding lead to GHL:', { firstName, lastName, email });
                if (req.body.isBooking) {
                    console.log('📅 Appointment Booking Received:', {
                        date: req.body.bookingDate,
                        time: req.body.bookingTime
                    });
                }

                const ghlResponse = await axios.post(ghlWebhookUrl, {
                    firstName,
                    lastName,
                    email,
                    phone,
                    serviceType,
                    message,
                    ...req.body, // Spread all questionnaire fields (intent, income, propertyValue, etc.)
                    source: 'Website Lead'
                });
                console.log('GHL response received. Status:', ghlResponse.status);
            } catch (ghlError) {
                console.error('Error forwarding lead to GoHighLevel:', ghlError.message);
                if (ghlError.response) {
                    console.error('GHL Error Response Data:', ghlError.response.data);
                }
            }
        }

        // Try to save to MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            const newLead = new ContactLead({
                name,
                email,
                phone,
                message,
                serviceType
            });
            await newLead.save();
            return res.status(201).json({ message: 'Lead submitted successfully', lead: newLead });
        } else {
            // Fallback: Save to local file
            console.warn('MongoDB not connected. Saving lead to local fallback file.');
            const fallbackPath = path.join(__dirname, '../leads_fallback.json');
            const leadData = {
                name,
                email,
                phone,
                message,
                serviceType,
                submittedAt: new Date().toISOString(),
                status: 'pending_sync'
            };

            let leads = [];
            try {
                const data = await fs.readFile(fallbackPath, 'utf8');
                leads = JSON.parse(data);
            } catch (err) {
                // File doesn't exist yet
            }

            leads.push(leadData);
            await fs.writeFile(fallbackPath, JSON.stringify(leads, null, 2));

            return res.status(201).json({
                message: 'Lead received and saved to fallback storage.',
                note: 'Database currently unavailable, lead will be synced later.'
            });
        }
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ error: 'Failed to submit lead' });
    }
});

// GET /api/contact (for verification purposes)
router.get('/', async (req, res) => {
    try {
        const leads = await ContactLead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

module.exports = router;
