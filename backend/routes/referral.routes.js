const express = require('express');
const router = express.Router();
const Referral = require('../models/referral.model');
const crypto = require('crypto');

// Generate a random unique code
const generateCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 characters
};

// Create a new referral
router.post('/', async (req, res) => {
    try {
        const { referrerName, referrerPhone, clientName, clientPhone } = req.body;
        
        if (!referrerName || !referrerPhone || !clientName || !clientPhone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const referralCode = generateCode();
        
        const newReferral = new Referral({
            referrerName,
            referrerPhone,
            clientName,
            clientPhone,
            referralCode
        });

        await newReferral.save();
        res.status(201).json(newReferral);
    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get referral by code
router.get('/:code', async (req, res) => {
    try {
        const referral = await Referral.findOne({ referralCode: req.params.code });
        if (!referral) {
            return res.status(404).json({ message: 'Referral link invalid or expired' });
        }
        res.json(referral);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all referrals (for admin)
router.get('/admin/all', async (req, res) => {
    try {
        // In a real app, add auth middleware here
        const referrals = await Referral.find().sort({ createdAt: -1 });
        res.json(referrals);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
