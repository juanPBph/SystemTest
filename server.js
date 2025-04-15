import express from 'express';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import mySqlPool from './config/db.js';
import lesseeRoute from './routes/lesseeRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/lessee', lesseeRoute);

app.get('/test', (req, res) => {
    res.status(200).send('<h1>SERVER RUNNING</h1>');
});

const PORT = process.env.PORT || 8080;

// // === CONFIG ===
const TEMPLATE_DOCUMENT_ID = '1cIFFkoZFrcMGKG21ALs5SSKvf5FUcVpmdg9jdd9YqCI'; // your template
const TARGET_FOLDER_ID = '1ANJCKkJYyjXTZtU8G9yvz1pZNL4dYpnc'; // your folder

// === AUTH ===
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',
    scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
    ],
});

// // === UTIL: Copy & Replace Placeholders ===
async function generateLeaseDoc(replacements) {
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    const docs = google.docs({ version: 'v1', auth: authClient });

    // 1. COPY TEMPLATE
    const copy = await drive.files.copy({
        fileId: TEMPLATE_DOCUMENT_ID,
        requestBody: {
            name: `Lease - ${replacements.tenant_name || 'New Tenant'}`,
            parents: [TARGET_FOLDER_ID],
        },
    });

    const newDocId = copy.data.id;
    console.log('✅ Copied doc ID:', newDocId);

    //     // 2. REPLACE PLACEHOLDERS
    const requests = Object.entries(replacements).map(([key, value]) => ({
        replaceAllText: {
            containsText: {
                text: `{{${key}}}`,
                matchCase: true,
            },
            replaceText: value,
        },
    }));

    const update = await docs.documents.batchUpdate({
        documentId: newDocId,
        requestBody: { requests },
    });

    console.log('✅ Placeholders replaced.');
    return newDocId;
}

// // === RUN TEMPLATE ON STARTUP ===
(async () => {
    const newDocId = await generateLeaseDoc({
        tenant_name: 'Juan Mendoza',
        landlord_name: 'PointBlue Realty',
        unit: 'Unit 401',
        building_name: 'PointBlue Makati',
        building_address: '123 Jupiter Street, Makati City',
        lease_start: 'April 15, 2025',
        lease_end: 'April 14, 2026',
        monthly_rent: '₱15,000',
        security_deposit: '₱30,000',
    });

    console.log(`📄 New Document Created: https://docs.google.com/document/d/${newDocId}/edit`);
})();

// === MYSQL CONNECTION & START SERVER ===
mySqlPool
    .query('SELECT 1')
    .then(() => {
        console.log('MYSQL DB CONNECTED');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MySQL Error:', error);
    });
