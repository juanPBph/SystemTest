import express from 'express';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import mySqlPool from './config/db.js';
import lesseeRoute from './routes/lesseeRoutes.js';
import nodemailer from 'nodemailer'
dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/lessee', lesseeRoute);

app.get('/test', (req, res) => {
    res.status(200).send('<h1>SERVER RUNNING</h1>');
});



const PORT = process.env.PORT || 8080;


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMMAIL, // your Gmail address
//         pass: process.env.EMPASS     // use App Password if 2FA is enabled
//     }
// });


// const mailOptions = {
//     from: '"Your Name" <your.email@gmail.com>',
//     to: 'juan@pointblue.ph',
//     subject: 'Hello from Node.js',
//     text: 'This is a test email from Node.js using Nodemailer.',
//     html: '<b>This is a test email from <i>Node.js</i> using Nodemailer.</b>'
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error:', error);
//     }
//     console.log('Message sent: %s', info.messageId);
// });


// const TEMPLATE_DOCUMENT_ID = '1cIFFkoZFrcMGKG21ALs5SSKvf5FUcVpmdg9jdd9YqCI'; // your template
// const TARGET_FOLDER_ID = '1ANJCKkJYyjXTZtU8G9yvz1pZNL4dYpnc'; // your folder


// const auth = new google.auth.GoogleAuth({
//     keyFile: './google.json',
//     scopes: [
//         'https://www.googleapis.com/auth/drive',
//         'https://www.googleapis.com/auth/documents',
//     ],
// });


// async function generateLeaseDoc(replacements) {
//     const authClient = await auth.getClient();
//     const drive = google.drive({ version: 'v3', auth: authClient });
//     const docs = google.docs({ version: 'v1', auth: authClient });


//     const copy = await drive.files.copy({
//         fileId: TEMPLATE_DOCUMENT_ID,
//         requestBody: {
//             name: `Lease - ${replacements.tenant_name || 'New Tenant'}`,
//             parents: [TARGET_FOLDER_ID],
//         },
//     });

//     const newDocId = copy.data.id;
//     console.log('✅ Copied doc ID:', newDocId);

//     const requests = Object.entries(replacements).map(([key, value]) => ({
//         replaceAllText: {
//             containsText: {
//                 text: `{{${key}}}`,
//                 matchCase: true,
//             },
//             replaceText: value,
//         },
//     }));

//     const update = await docs.documents.batchUpdate({
//         documentId: newDocId,
//         requestBody: { requests },
//     });

//     console.log('✅ Placeholders replaced.');
//     return newDocId;
// }

// (async () => {
//     const newDocId = await generateLeaseDoc({
//         tenant_name: 'Juan Mendoza',
//         landlord_name: 'PointBlue Realty',
//         unit: 'Unit 401',
//         building_name: 'PointBlue Makati',
//         building_address: '123 Jupiter Street, Makati City',
//         lease_start: 'April 15, 2025',
//         lease_end: 'April 14, 2026',
//         monthly_rent: '₱15,000',
//         security_deposit: '₱30,000',
//     });

//     console.log(`📄 New Document Created: https://docs.google.com/document/d/${newDocId}/edit`);
// })();

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
