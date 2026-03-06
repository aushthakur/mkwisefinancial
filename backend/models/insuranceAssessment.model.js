const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    type: { type: String, required: true },
    amount: { type: String, required: true },
    duration: { type: String, required: true },
    basis: { type: String, required: true },
    forWhom: { type: String, required: true },
    waiverOfPremium: { type: Boolean, default: false }
});

const ApplicantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    smokingStatus: { type: String, required: true },
});

const InsuranceAssessmentSchema = new mongoose.Schema({
    // Section 1: Personal & Product Details
    primaryApplicant: ApplicantSchema,
    hasSecondApplicant: { type: Boolean, default: false },
    secondApplicant: ApplicantSchema,
    products: [ProductSchema],

    // Section 2: Contact Information
    contact: {
        address: { type: String, required: true },
        telephone: { type: String, required: true },
        alternativeTelephone: { type: String },
        email: { type: String, required: true }
    },

    // Section 3: Physical Attributes & Initial Health
    healthBasics: {
        height: { type: String, required: true },
        weight: { type: String, required: true },
        job: { type: String, required: true },
        smokingHistory: { type: String, required: true },
        familyMedicalHistory: [String] // Heart Disease, Stroke, etc.
    },

    // Section 4: Mental Health History
    mentalHealth: {
        last5Years: [String], // Depression, Anxiety, etc.
        everHad: [String], // Eating disorder, Bipolar, etc.
        suicidalThoughts: { type: String, enum: ['Yes', 'No'] },
        selfHarm: { type: String, enum: ['Yes', 'No'] }
    },

    // Section 5: Medical History (Physical)
    physicalMedicalHistory: {
        everHadSerious: [String], // Cancer, Heart attack, etc.
        everHadChronic: [String], // MS, Epilepsy, etc.
        last5YearsConditions: [String], // BP, Diabetes, etc.
        last5YearsMinor: [String], // Asthma, COVD, etc.
        last3YearsEvents: [String], // Prescribed treatment, referrals, etc.
        last3MonthsSymptoms: [String] // Breast changes, bleeding, etc.
    },

    // Section 6: Lifestyle & Habits
    lifestyle: {
        alcohol: {
            pintsBeer: { type: Number, default: 0 },
            glassesWine: { type: Number, default: 0 },
            measuresSpirits: { type: Number, default: 0 }
        },
        alcoholDrugIssues: [String], // Medical advice to stop, drug use, etc.
        highRiskActivities: [String], // Armed forces, Scuba, etc.
        drivingTravelIssues: [String], // Bans, motorbike, etc.
        internationalTravel: { type: String, enum: ['Yes', 'No'] },
        existingInsurance: { type: String, enum: ['Yes', 'No'] }
    },

    // Section 7: Occupation Details
    occupationDetails: [String], // Working at heights, heavy machinery, etc.

    status: { type: String, default: 'New', enum: ['New', 'Reviewed', 'Archived'] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InsuranceAssessment', InsuranceAssessmentSchema);
