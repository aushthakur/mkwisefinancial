const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const ContactLead = require('../models/contactForm.model');
const { logAlert } = require('./leadMonitor');

const FALLBACK_PATH = path.join(__dirname, '../leads_fallback.json');
let isSyncing = false;

/**
 * Upserts a contact to GHL API (for Webinar leads).
 */
async function syncToGhlApi(lead) {
    const ghlAccessToken = process.env.GHL_ACCESS_TOKEN || 'pit-9dfb9d81-a2a1-448a-ab4e-7cc36b670e7e';
    const locationId = '9XGJdS89KjPnK9P3CiMz';
    
    // Parse tags (webinar registrations get custom tags)
    const customTags = lead.metadata?.tags || ['Webinar-9July', 'FirstHome-Webinar'];

    // Upsert contact
    const upsertResponse = await axios.post(
        'https://services.leadconnectorhq.com/contacts/upsert',
        {
            firstName: lead.name,
            email: lead.email,
            phone: lead.phone,
            tags: customTags,
            locationId,
            source: lead.metadata?.source || 'Webinar Landing Page'
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

    // Explicitly add tags in case upsert matches existing record but does not merge tags
    if (contactId) {
        await axios.post(
            `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
            { tags: customTags },
            {
                headers: {
                    'Authorization': `Bearer ${ghlAccessToken}`,
                    'Version': '2021-07-28',
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

/**
 * Forwards a standard contact lead to the GHL webhook.
 */
async function syncToGhlWebhook(lead) {
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;
    if (!ghlWebhookUrl || ghlWebhookUrl === 'your_ghl_webhook_url_here') {
        throw new Error('GHL Webhook URL not configured');
    }

    const nameParts = lead.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    await axios.post(ghlWebhookUrl, {
        firstName,
        lastName,
        email: lead.email,
        phone: lead.phone,
        serviceType: lead.serviceType,
        message: lead.message,
        ...lead.metadata,
        source: 'Website Lead'
    });
}

/**
 * Attempts GHL sync for a single lead.
 */
async function syncLeadToGHL(lead) {
    if (lead.serviceType && lead.serviceType.startsWith('Webinar')) {
        await syncToGhlApi(lead);
    } else {
        await syncToGhlWebhook(lead);
    }
}

/**
 * Helper to update lead status in the fallback file.
 */
async function updateFallbackLeadStatus(email, phone, serviceType, mongoStatus, ghlStatus, ghlRetryCount, ghlError) {
    try {
        const data = await fs.readFile(FALLBACK_PATH, 'utf8');
        let leads = JSON.parse(data);
        let updated = false;

        leads = leads.map(l => {
            // Match lead by email, phone, and serviceType
            if (l.email === email && l.phone === phone && l.serviceType === serviceType) {
                updated = true;
                const updatedLead = {
                    ...l,
                    mongoSyncStatus: mongoStatus || l.mongoSyncStatus,
                    ghlSyncStatus: ghlStatus || l.ghlSyncStatus,
                    ghlRetryCount: typeof ghlRetryCount === 'number' ? ghlRetryCount : l.ghlRetryCount,
                    ghlError: ghlError !== undefined ? ghlError : l.ghlError
                };
                if (updatedLead.status === 'pending_sync') {
                    updatedLead.status = 'synced';
                }
                return updatedLead;
            }
            return l;
        });

        if (updated) {
            await fs.writeFile(FALLBACK_PATH, JSON.stringify(leads, null, 2));
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('❌ Failed to update status in fallback file:', err.message);
        }
    }
}

/**
 * 1. Synchronizes pending leads from fallback file to MongoDB.
 */
async function syncFallbackToMongo() {
    if (mongoose.connection.readyState !== 1) return;

    try {
        const data = await fs.readFile(FALLBACK_PATH, 'utf8');
        const leads = JSON.parse(data);
        const pendingLeads = leads.filter(l => l.mongoSyncStatus === 'Pending' || l.status === 'pending_sync');

        if (pendingLeads.length === 0) return;

        console.log(`🔄 Syncing ${pendingLeads.length} fallback leads to MongoDB...`);

        for (const lead of pendingLeads) {
            try {
                // Check if already in Mongo (avoid duplicates if retry was partially successful)
                let existing = await ContactLead.findOne({
                    email: lead.email,
                    phone: lead.phone,
                    serviceType: lead.serviceType
                });

                if (!existing) {
                    existing = new ContactLead({
                        name: lead.name || lead.firstName,
                        email: lead.email,
                        phone: lead.phone,
                        serviceType: lead.serviceType,
                        message: lead.message || 'Webinar registration.',
                        ghlSyncStatus: lead.ghlSyncStatus || 'Pending',
                        ghlRetryCount: lead.ghlRetryCount || 0,
                        ghlError: lead.ghlError || '',
                        duplicateCount: lead.duplicateCount || 0,
                        duplicateAttempts: lead.duplicateAttempts || [],
                        metadata: lead.metadata || {},
                        createdAt: lead.submittedAt ? new Date(lead.submittedAt) : new Date()
                    });
                    await existing.save();
                }

                // Update the lead status to Success in fallback file
                await updateFallbackLeadStatus(lead.email, lead.phone, lead.serviceType, 'Success', null);
                console.log(`✅ Synced fallback lead to MongoDB: ${lead.email}`);
            } catch (mongoErr) {
                console.error(`❌ Failed to import fallback lead to Mongo (${lead.email}):`, mongoErr.message);
            }
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error('❌ Failed to process fallback leads sync:', err.message);
        }
    }
}

/**
 * 2. Retries GHL sync for failed or pending leads in MongoDB.
 */
async function syncMongoToGHL() {
    if (mongoose.connection.readyState !== 1) return;

    try {
        const pendingLeads = await ContactLead.find({
            ghlSyncStatus: { $in: ['Pending', 'Failed'] }
        });

        if (pendingLeads.length === 0) return;

        console.log(`🔄 Syncing ${pendingLeads.length} pending GHL contacts...`);

        for (const lead of pendingLeads) {
            try {
                await syncLeadToGHL(lead);

                // Success
                lead.ghlSyncStatus = 'Success';
                lead.ghlError = '';
                await lead.save();

                // Update in fallback file too
                await updateFallbackLeadStatus(lead.email, lead.phone, lead.serviceType, 'Success', 'Success', lead.ghlRetryCount, '');
                console.log(`✅ Synced lead to GHL: ${lead.email}`);
            } catch (ghlErr) {
                // Fail
                lead.ghlSyncStatus = 'Failed';
                lead.ghlRetryCount += 1;
                lead.ghlError = ghlErr.message;
                await lead.save();

                // Update in fallback file
                await updateFallbackLeadStatus(lead.email, lead.phone, lead.serviceType, 'Success', 'Failed', lead.ghlRetryCount, ghlErr.message);

                console.error(`❌ GHL retry failed for ${lead.email} (Attempt #${lead.ghlRetryCount}):`, ghlErr.message);

                // Raise system alert on continuous failure (e.g. 3 attempts)
                if (lead.ghlRetryCount % 3 === 0) {
                    await logAlert(
                        'GHL Sync Failure',
                        `GHL sync failed continuously for lead ${lead.email} (Retries: ${lead.ghlRetryCount}).`,
                        {
                            name: lead.name,
                            email: lead.email,
                            phone: lead.phone,
                            serviceType: lead.serviceType,
                            retryCount: lead.ghlRetryCount,
                            error: ghlErr.message
                        }
                    );
                }
            }
        }
    } catch (err) {
        console.error('❌ Failed to retrieve sync-pending leads from Mongo:', err.message);
    }
}

/**
 * Executes a full sync iteration.
 */
async function runSyncCycle() {
    if (isSyncing) return;
    isSyncing = true;
    try {
        // First sync local fallback leads to Mongo if connection is back
        await syncFallbackToMongo();
        // Then sync Mongo leads to GHL
        await syncMongoToGHL();
    } catch (err) {
        console.error('❌ Error during sync cycle:', err.message);
    } finally {
        isSyncing = false;
    }
}

/**
 * Starts the background sync loop.
 */
function startSyncScheduler(intervalMs = 60000) {
    console.log(`⏰ Starting background sync scheduler (Interval: ${intervalMs / 1000}s)...`);
    // Run immediately on start
    runSyncCycle();
    // Run periodically
    setInterval(runSyncCycle, intervalMs);
}

module.exports = {
    startSyncScheduler,
    runSyncCycle
};
