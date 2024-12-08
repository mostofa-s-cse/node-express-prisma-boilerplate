import nodemailer from "nodemailer";

// Create the transporter using Gmail service and environment variables for user and password
const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER,     // Email user (sender's email)
        pass: process.env.EMAIL_PASSWORD, // App password or regular password for Gmail
    },
});

/**
 * Sends an email with an HTML body.
 *
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param name - The name of the recipient to personalize the email.
 * @param otp - The OTP code to send to the recipient.
 */
export const sendEmail = async (to: string, subject: string, name: string, otp: string) => {
    // HTML template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .email-container { padding: 20px; background-color: #f3f3f3; border-radius: 5px; }
            .email-header { font-size: 24px; color: #333; }
            .email-content { margin-top: 10px; font-size: 16px; color: #555; }
        </style>
    </head>
    <body>
       <div class="email-container">
            <h2 class="email-header">Hello, ${name}!</h2>
            <p class="email-content">Your OTP is: <strong>${otp}</strong></p>
            <p class="email-content">Please use this OTP to verify your email.</p>
            <p class="email-content">Note: This OTP will expire in <strong>3 minutes</strong>.</p>
        </div>
    </body>
    </html>`;

    try {
        // Send email with the HTML content
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Sender's email
            to,                          // Recipient's email
            subject,                     // Subject of the email
            html: htmlTemplate,          // HTML body of the email
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
