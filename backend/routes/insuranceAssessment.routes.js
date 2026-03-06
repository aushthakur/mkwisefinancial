const express = require('express');
const router = express.Router();
const InsuranceAssessment = require('../models/insuranceAssessment.model');
const nodemailer = require('nodemailer');

// Admin credentials (from user request)
const ADMIN_EMAIL = 'admin@mkwisefinancial.com';
const ADMIN_PASSWORD = 'admin1234';

// Middleware for basic admin auth (simple check for this demo/request)
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Basic ${Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}`).toString('base64')}`) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Login route for admin dashboard
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // In a real app, generate a JWT. For now, just return success.
        res.json({ success: true, email: ADMIN_EMAIL });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Helper to format the assessment report
const formatAssessmentReport = (data) => {
    let report = `<h2>Insurance Pre-Assessment Report</h2>`;
    report += `<p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p><hr/>`;

    // Section 1: Personal
    report += `<h3>Section 1: Personal & Product Details</h3>`;
    report += `<p><strong>Primary Applicant:</strong> ${data.primaryApplicant.firstName} ${data.primaryApplicant.lastName} (${data.primaryApplicant.gender}, DOB: ${new Date(data.primaryApplicant.dob).toLocaleDateString()})</p>`;
    report += `<p><strong>Smoking Status:</strong> ${data.primaryApplicant.smokingStatus}</p>`;

    if (data.hasSecondApplicant) {
        report += `<p><strong>Second Applicant:</strong> ${data.secondApplicant.firstName} ${data.secondApplicant.lastName} (${data.secondApplicant.gender}, DOB: ${new Date(data.secondApplicant.dob).toLocaleDateString()})</p>`;
        report += `<p><strong>Smoking Status:</strong> ${data.secondApplicant.smokingStatus}</p>`;
    }

    report += `<h4>Products Needed</h4>`;
    data.products.forEach((p, i) => {
        report += `<p>${i + 1}. ${p.type} - £${p.amount} over ${p.duration} years (${p.basis}, ${p.forWhom}, Waiver: ${p.waiverOfPremium ? 'Yes' : 'No'})</p>`;
    });

    // Section 2: Contact
    report += `<hr/><h3>Section 2: Contact Information</h3>`;
    report += `<p><strong>Address:</strong> ${data.contact.address}</p>`;
    report += `<p><strong>Telephone:</strong> ${data.contact.telephone}</p>`;
    if (data.contact.alternativeTelephone) report += `<p><strong>Alternative Phone:</strong> ${data.contact.alternativeTelephone}</p>`;
    report += `<p><strong>Email:</strong> ${data.contact.email}</p>`;

    // Section 3: Health Basics
    report += `<hr/><h3>Section 3: Physical Attributes & Initial Health</h3>`;
    report += `<p><strong>Height:</strong> ${data.healthBasics.height}, <strong>Weight:</strong> ${data.healthBasics.weight}</p>`;
    report += `<p><strong>Job:</strong> ${data.healthBasics.job}</p>`;
    report += `<p><strong>Smoking History:</strong> ${data.healthBasics.smokingHistory}</p>`;
    report += `<p><strong>Family Medical History:</strong> ${data.healthBasics.familyMedicalHistory.join(', ') || 'None'}</p>`;

    // Section 4: Mental Health
    report += `<hr/><h3>Section 4: Mental Health History</h3>`;
    report += `<p><strong>Last 5 Years:</strong> ${data.mentalHealth.last5Years.join(', ') || 'None'}</p>`;
    report += `<p><strong>Ever Had:</strong> ${data.mentalHealth.everHad.join(', ') || 'None'}</p>`;
    report += `<p><strong>Suicidal Thoughts:</strong> ${data.mentalHealth.suicidalThoughts}</p>`;
    report += `<p><strong>Self Harm Attempted:</strong> ${data.mentalHealth.selfHarm}</p>`;

    // Section 5: Medical History (Physical)
    report += `<hr/><h3>Section 5: Medical History (Physical)</h3>`;
    report += `<p><strong>Serious Conditions:</strong> ${data.physicalMedicalHistory.everHadSerious.join(', ') || 'None'}</p>`;
    report += `<p><strong>Chronic Conditions:</strong> ${data.physicalMedicalHistory.everHadChronic.join(', ') || 'None'}</p>`;
    report += `<p><strong>Last 5 Years (BP, etc):</strong> ${data.physicalMedicalHistory.last5YearsConditions.join(', ') || 'None'}</p>`;
    report += `<p><strong>Last 5 Years (Asthma, etc):</strong> ${data.physicalMedicalHistory.last5YearsMinor.join(', ') || 'None'}</p>`;
    report += `<p><strong>Last 3 Years Events:</strong> ${data.physicalMedicalHistory.last3YearsEvents.join(', ') || 'None'}</p>`;
    report += `<p><strong>Last 3 Months Symptoms:</strong> ${data.physicalMedicalHistory.last3MonthsSymptoms.join(', ') || 'None'}</p>`;

    // Section 6: Lifestyle
    report += `<hr/><h3>Section 6: Lifestyle & Habits</h3>`;
    const alc = data.lifestyle.alcohol;
    report += `<p><strong>Alcohol Weekly:</strong> Beer: ${alc.pintsBeer} pints, Wine: ${alc.glassesWine} glasses, Spirits: ${alc.measuresSpirits} measures</p>`;
    report += `<p><strong>Alcohol/Drug Issues:</strong> ${data.lifestyle.alcoholDrugIssues.join(', ') || 'None'}</p>`;
    report += `<p><strong>High Risk Activities:</strong> ${data.lifestyle.highRiskActivities.join(', ') || 'None'}</p>`;
    report += `<p><strong>Driving/Travel Issues:</strong> ${data.lifestyle.drivingTravelIssues.join(', ') || 'None'}</p>`;
    report += `<p><strong>Worked outside UK/EU:</strong> ${data.lifestyle.internationalTravel}</p>`;
    report += `<p><strong>Existing/Other Life Insurance:</strong> ${data.lifestyle.existingInsurance}</p>`;

    // Section 7: Occupation
    report += `<hr/><h3>Section 7: Occupation Details</h3>`;
    report += `<p>${data.occupationDetails.join(', ') || 'None'}</p>`;

    return report;
};

// POST /api/insurance-assessment
router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };

        // Clean data: if no second applicant, remove the empty object to avoid validation errors
        if (!data.hasSecondApplicant) {
            delete data.secondApplicant;
        }

        const assessment = new InsuranceAssessment(data);
        await assessment.save();

        // Send Email Notification
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"MKWise Insurance Portal" <${process.env.SMTP_USER}>`,
            to: 'jayant.thakur.digital@gmail.com, mukesh@mkwisefinancial.com',
            subject: `New Insurance Assessment: ${assessment.primaryApplicant.firstName} ${assessment.primaryApplicant.lastName}`,
            html: formatAssessmentReport(assessment)
        };

        transporter.sendMail(mailOptions).catch(err => console.error('Nodemailer error:', err));

        res.status(201).json({ success: true, message: 'Assessment submitted successfully' });
    } catch (error) {
        console.error('Error submitting assessment:', error);

        if (error.name === 'ValidationError') {
            const missingFields = Object.keys(error.errors).map(key => {
                // Map internal path names to more user-friendly labels
                const path = key.split('.');
                const fieldName = path[path.length - 1];
                const section = path.length > 1 ? path[0] : '';

                // Humanize the names
                const labels = {
                    'primaryApplicant': 'Primary Applicant',
                    'secondApplicant': 'Second Applicant',
                    'contact': 'Contact info',
                    'healthBasics': 'Health details',
                    'firstName': 'First Name',
                    'lastName': 'Surname',
                    'dob': 'Date of Birth',
                    'smokingStatus': 'Smoking Status',
                    'job': 'Occupation',
                    'smokingHistory': 'Detailed Smoking History'
                };

                const prefix = labels[section] || section;
                const label = labels[fieldName] || fieldName;

                return section ? `${prefix}: ${label}` : label;
            });

            return res.status(400).json({
                error: `The following fields are required: ${missingFields.join(', ')}`,
                fields: missingFields
            });
        }

        res.status(500).json({ error: 'Failed to submit assessment' });
    }
});

// GET /api/insurance-assessment (Admin only)
router.get('/', adminAuth, async (req, res) => {
    try {
        const assessments = await InsuranceAssessment.find().sort({ createdAt: -1 });
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});

// PATCH /api/insurance-assessment/:id (Update status)
router.patch('/:id', adminAuth, async (req, res) => {
    try {
        const assessment = await InsuranceAssessment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(assessment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update assessment' });
    }
});

module.exports = router;
