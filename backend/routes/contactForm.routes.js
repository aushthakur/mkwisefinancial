const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ContactLead = require('../models/contactForm.model');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
    console.log('📩 Processing new lead enquiry for email notification...');
    try {
        const { name, email, phone, message, serviceType } = req.body;

        // --- NODEMAILER NOTIFICATION ---
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT == 465, // false for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM || `"MKWise Website" <${process.env.SMTP_USER}>`,
            to: 'jayant.thakur.digital@gmail.com, mukesh@mkwisefinancial.com',
            subject: `New Inquiry Received: ${name}`,
            text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${serviceType}
Message: ${message}
            `,
            html: `
<h3>New Inquiry Received</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Service:</strong> ${serviceType}</p>
<hr />
<p><strong>Message:</strong></p>
<pre>${message}</pre>
            `,
        };

        // Send email and log result
        try {
            console.log(`📤 Attempting to send email from ${process.env.SMTP_USER} to recipients...`);
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully. Message ID:', info.messageId);
        } catch (mailError) {
            console.error('❌ Nodemailer error:', mailError.message);
            // We don't necessarily want to fail the whole request if email fails, 
            // but we should know about it.
        }
        // --- END NODEMAILER ---

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
            // Extract core fields and put the rest in metadata
            const { name, email, phone, message, serviceType, ...rest } = req.body;

            const newLead = new ContactLead({
                name,
                email,
                phone,
                message,
                serviceType: serviceType || 'General Inquiry',
                metadata: rest // Stores booking info, questionnaire flow, etc.
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

// POST /api/contact/webhook (Public for GHL)
router.post('/webhook', async (req, res) => {
    console.log('📅 Received GHL Webhook:', req.body);
    try {
        const { email, firstName, lastName, phone, type, startTime, selectedTimezone } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email in webhook' });
        }

        // Check if it's an appointment
        const isBooking = type === 'Appointment' || req.body.appointmentStatus;

        const newLead = new ContactLead({
            name: `${firstName || ''} ${lastName || ''}`.trim() || 'GHL Lead',
            email,
            phone: phone || 'N/A',
            serviceType: isBooking ? 'Calendar Booking' : 'GHL Sync',
            message: isBooking ? `Appointment confirmed for ${startTime} (${selectedTimezone})` : 'Lead synced from GoHighLevel',
            metadata: {
                ...req.body,
                isBooking,
                bookingDate: startTime ? new Date(startTime).toLocaleDateString() : null,
                bookingTime: startTime ? new Date(startTime).toLocaleTimeString() : null
            }
        });

        await newLead.save();
        res.status(200).json({ message: 'Webhook processed' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin credentials (consistent with insuranceAssessment.routes.js)
const ADMIN_EMAIL = 'admin@mkwisefinancial.com';
const ADMIN_PASSWORD = 'admin1234';

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Basic ${Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString('base64')}`) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// GET /api/contact (Admin protected)
router.get('/', adminAuth, async (req, res) => {
    try {
        const leads = await ContactLead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// PATCH /api/contact/:id (Update status)
router.patch('/:id', adminAuth, async (req, res) => {
    try {
        const lead = await ContactLead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

module.exports = router;
