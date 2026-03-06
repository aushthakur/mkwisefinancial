require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Testing SMTP Connection ---');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully!');

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: 'jayant.thakur.digital@gmail.com, mukesh@mkwisefinancial.com',
            subject: 'MKWise Lead Diagnostic (Both Emails)',
            text: 'If you receive this, the SMTP configuration and multi-recipient logic are working.'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error during SMTP test:');
        console.error(error);
    }
}

testEmail();
