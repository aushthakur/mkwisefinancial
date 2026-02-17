const express = require('express');
const router = express.Router();
const ContactLead = require('../models/contactForm.model');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message, serviceType } = req.body;
        const newLead = new ContactLead({
            name,
            email,
            phone,
            message,
            serviceType
        });
        await newLead.save();
        res.status(201).json({ message: 'Lead submitted successfully', lead: newLead });
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
