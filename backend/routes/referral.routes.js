const express = require('express');
const router = express.Router();
const Referral = require('../models/referral.model');
const crypto = require('crypto');

// Generate a random unique code
const generateCode = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 characters
};

// Helper to sanitize custom referral code into URL slug
const slugify = (text) => {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '_')           // Replace spaces with _
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_');        // Replace multiple dashes with single _
};

// Create a new referral (Supports both client specific and employee links)
router.post('/', async (req, res) => {
    try {
        const { referrerName, referrerPhone, clientName, clientPhone, customCode } = req.body;
        
        if (!referrerName) {
            return res.status(400).json({ message: 'Referrer Name is required' });
        }

        let referralCode;
        if (customCode && customCode.trim()) {
            referralCode = slugify(customCode);
            // Check if code exists
            const existing = await Referral.findOne({ referralCode });
            if (existing) {
                // Append random suffix if exists
                referralCode = `${referralCode}_${generateCode().slice(0, 4).toLowerCase()}`;
            }
        } else {
            // Slugify referrer name or fallback to random hex
            const baseSlug = slugify(referrerName);
            const existing = await Referral.findOne({ referralCode: baseSlug });
            referralCode = existing ? `${baseSlug}_${generateCode().slice(0, 4).toLowerCase()}` : baseSlug;
        }

        const newReferral = new Referral({
            referrerName,
            referrerPhone: referrerPhone || '',
            clientName: clientName || 'General Referral',
            clientPhone: clientPhone || '',
            referralCode,
            status: 'active'
        });

        await newReferral.save();
        res.status(201).json(newReferral);
    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get referral by code (case-insensitive lookup with dynamic fallback)
router.get('/:code', async (req, res) => {
    try {
        const reqCode = req.params.code.trim().toLowerCase();
        let referral = await Referral.findOne({ 
            referralCode: { $regex: new RegExp(`^${reqCode}$`, 'i') } 
        });

        if (!referral) {
            // Fallback: Return dynamic referrer structure so employee links work dynamically
            const formattedName = reqCode
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());

            referral = {
                referrerName: formattedName || reqCode,
                referrerPhone: '',
                clientName: 'Valued Client',
                clientPhone: '',
                referralCode: reqCode,
                status: 'active',
                isDynamic: true
            };
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
