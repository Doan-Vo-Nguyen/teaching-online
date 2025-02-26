// send mail using nodemailer
import nodemailer from "nodemailer";
import { RESET_CODE_EXPIRE } from "../constant";
const sendMail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export const sendMailResetPassword = async (to: string, token: string) => {
  const subject = "Reset Your Password - The Edu Space Team";
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`; // Assuming the link expires in 60 minutes
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
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ffc107;
            color: #002147;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #e0a800;
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
            <p>We received a request to reset the password for your account on <strong>The Edu Space</strong>. If you initiated this request, please click the button below to set a new password.</p>
            <p>
                <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>Please note that this link will expire in <span class="highlight">${expiryMinutes} minutes</span> for security reasons.</p>
            <p>If you did not request this password reset, your action is needed to secure your account!.</p>
            <p>Should you require any assistance, please do not hesitate to contact our support team.</p>
            <p>Best regards,<br><strong>The Edu Space Team</strong></p>
        </div>
        <div class="footer">
            <p>This email was sent to you because a password reset was requested for your account. If you did not make this request, please disregard this message.</p>
        </div>
    </div>
</body>
</html>

    `;
  await sendMail(to, subject, html);
};

export default sendMail;
