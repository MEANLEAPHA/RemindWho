require('dotenv').config(); // Load env variables
const nodemailer = require('nodemailer');

// Sanity check - fail loudly on startup if these are missing
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS is missing from environment variables in util/email.js');
} else {
    console.log('✅ util/email.js loaded EMAIL_USER:', process.env.EMAIL_USER, '| EMAIL_PASS length:', process.env.EMAIL_PASS.length);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // Use SSL
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

// Optional: verify connection on load so auth issues show up immediately in logs
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ util/email.js transporter verification failed:', error.message);
    } else {
        console.log('✅ util/email.js transporter is ready to send emails');
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"RemindWho Bot" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log('✅ Email sent:', info.response);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

const sendPinCodeEmail = async (to, pinCode) => {
    const subject = 'Your Verification Code';
    const html = `<p>Your verification code is: <b>${pinCode}</b></p>`;

    try {
        const info = await transporter.sendMail({
            from: `"RemindWho Bot" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log('✅ Verification email sent:', info.response);
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
    }
};

const sendResendPinEmail = async (to, pinCode) => {
    const subject = 'Your New Verification Code';
    const html = `<p>Your new verification code is: <b>${pinCode}</b></p>`;

    try {
        const info = await transporter.sendMail({
            from: `"RemindWho Bot" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log('✅ Resend verification email sent:', info.response);
    } catch (error) {
        console.error('❌ Error sending resend verification email:', error);
    }
};

const sendResetPasswordPinEmail = async (to, pinCode) => {
    const subject = 'Reset Your RemindWho Password';
    const html = `
    <p>We received a request to reset your RemindWho password.</p>
    <p>Use the following 6-digit code:</p>
    <h2 style="letter-spacing: 3px;">${pinCode}</h2>
    <p>This code is valid for 10 minutes. If you didn't request this, please ignore the email.</p>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"RemindWho Bot" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log('✅ Password reset email sent:', info.response);
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
    }
};

module.exports = { sendEmail, sendPinCodeEmail, sendResendPinEmail, sendResetPasswordPinEmail };