import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: process.env.EMAIL_SERVICE_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});

/**
 * Sends an email.
 * NOTE: In a real application, ensure EMAIL_SERVICE_USER and EMAIL_SERVICE_PASS are set securely.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} htmlContent - HTML body of the email.
 */
export const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_SERVICE_USER,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        // In development, we might allow this to pass if email config is missing
        if (!process.env.EMAIL_SERVICE_USER) {
            console.warn("Email service credentials missing. Skipping actual email send.");
            return true; 
        }
        throw new Error("Failed to send password reset email.");
    }
};