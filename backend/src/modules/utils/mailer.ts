// send mail using nodemailer
import nodemailer from "nodemailer";
import { RESET_CODE_EXPIRE } from "../constant";
import { Logger } from "../config/logger";

// Create transporter once instead of for each email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
    };
    transporter.sendMail(mailOptions)
        .then((info) => {
            Logger.info(`Email sent: ${info.response}`);
        })
        .catch((error) => {
            Logger.error(`Error sending email: ${error}`);
        });
    return {queued: true};
};

export const sendMailResetPassword = async (to: string, token: string) => {
    const subject = "Reset Your Password - The Edu Space Team";
    const expiryMinutes = RESET_CODE_EXPIRE / (60 * 1000);
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - The Edu Space</title>
        <style>
                body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f7fc;
                        color: #333;
                }
                .container {
                        max-width: 600px;
                        margin: 40px auto;
                        padding: 30px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                }
                .header {
                        background-color: #002147;
                        color: #ffffff;
                        padding: 15px;
                        font-size: 22px;
                        font-weight: bold;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                }
                .content {
                        padding: 20px;
                        text-align: left;
                }
                h1 {
                        color: #002147;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        text-align: center;
                }
                p {
                        font-size: 16px;
                        margin-bottom: 15px;
                }
                .code-container {
                        background-color: #f7f7f7;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        padding: 15px;
                        margin: 20px auto;
                        font-size: 24px;
                        font-weight: bold;
                        letter-spacing: 5px;
                        text-align: center;
                        color: #002147;
                }
                .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #777;
                        text-align: center;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                }
                .highlight {
                        font-weight: bold;
                        color: #002147;
                }
        </style>
</head>
<body>
        <div class="container">
                <div class="header">The Edu Space - Password Reset Request</div>
                <div class="content">
                        <h1>Reset Your Password</h1>
                        <p>Dear <span class="highlight">${to}</span>,</p>
                        <p>We received a request to reset the password for your account on <strong>The Edu Space</strong>. Please use the code below to reset your password:</p>
                        <div class="code-container">
                                ${token}
                        </div>
                        <p>Please note that this code will expire in <span class="highlight">${expiryMinutes} minutes</span> for security reasons.</p>
                        <p>If you did not request this password reset, your action is needed to secure your account!.</p>
                        <p>Should you require any assistance, please do not hesitate to contact our support team.</p>
                        <p>Best regards,<br><strong>The Edu Space Team</strong></p>
                </div>
                <div class="footer">
                        <p>This email was sent to you because a password reset was requested for your account. If you did not make this request, please disregard this message.</p>
                </div>
        </div>
</body>
</html>`;

    return sendMail(to, subject, html);
};

export default sendMail;
