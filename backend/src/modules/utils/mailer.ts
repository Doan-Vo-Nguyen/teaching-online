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
    const subject = "Mã OTP đặt lại mật khẩu - HP Edtech Center";
    const expiryMinutes = RESET_CODE_EXPIRE / (60 * 1000);
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã OTP đặt lại mật khẩu - HP Edtech Center</title>
        <style>
                body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        margin: 0;
                        padding: 0;
                        background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                        color: #333;
                        min-height: 100vh;
                }
                .container {
                        max-width: 500px;
                        margin: 20px auto;
                        padding: 0;
                        background-color: #ffffff;
                        border-radius: 15px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                        overflow: hidden;
                }
                .header {
                        background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                        color: #ffffff;
                        padding: 25px 20px;
                        text-align: center;
                        position: relative;
                }
                .header::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
                        opacity: 0.3;
                }
                .logo {
                        font-size: 28px;
                        font-weight: 700;
                        margin-bottom: 5px;
                        position: relative;
                        z-index: 1;
                }
                .subtitle {
                        font-size: 14px;
                        opacity: 0.9;
                        position: relative;
                        z-index: 1;
                }
                .content {
                        padding: 30px 25px;
                        text-align: center;
                }
                h1 {
                        color: #2d3748;
                        font-size: 22px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        text-align: center;
                }
                p {
                        font-size: 15px;
                        margin-bottom: 20px;
                        color: #4a5568;
                        line-height: 1.6;
                }
                .otp-container {
                        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 25px;
                        margin: 25px 0;
                        position: relative;
                        overflow: hidden;
                }
                .otp-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, #ff6b35, #2196f3);
                }
                .otp-label {
                        font-size: 14px;
                        color: #718096;
                        margin-bottom: 10px;
                        font-weight: 500;
                }
                .otp-code {
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: 8px;
                        color: #2d3748;
                        font-family: 'Courier New', monospace;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .warning-box {
                        background-color: #fff5f5;
                        border: 1px solid #fed7d7;
                        border-radius: 8px;
                        padding: 15px;
                        margin: 20px 0;
                        text-align: left;
                }
                .warning-icon {
                        color: #e53e3e;
                        font-weight: bold;
                        margin-right: 8px;
                }
                .footer {
                        background-color: #f7fafc;
                        padding: 20px 25px;
                        font-size: 12px;
                        color: #718096;
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                }
                .highlight {
                        font-weight: 600;
                        color: #ff6b35;
                }
                .contact-info {
                        margin-top: 15px;
                        padding-top: 15px;
                        border-top: 1px solid #e2e8f0;
                        font-size: 13px;
                }
        </style>
</head>
<body>
        <div class="container">
                <div class="header">
                        <div class="logo">HP Edtech Center</div>
                        <div class="subtitle">Hệ thống quản lý giáo dục</div>
                </div>
                <div class="content">
                        <h1>🔐 Mã OTP đặt lại mật khẩu</h1>
                        <p>Xin chào <span class="highlight">${to}</span>,</p>
                        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để hoàn tất quá trình đặt lại mật khẩu:</p>
                        
                        <div class="otp-container">
                                <div class="otp-label">Mã OTP của bạn:</div>
                                <div class="otp-code">${token}</div>
                        </div>
                        
                        <div class="warning-box">
                                <p><span class="warning-icon">⚠️</span> <strong>Lưu ý quan trọng:</strong></p>
                                <p>• Mã OTP này sẽ hết hạn sau <span class="highlight">${expiryMinutes} phút</span></p>
                                <p>• Không chia sẻ mã này với bất kỳ ai</p>
                                <p>• Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</p>
                        </div>
                        
                        <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
                        <p>Trân trọng,<br><strong>Đội ngũ HP Edtech Center</strong></p>
                </div>
                <div class="footer">
                        <p>Email này được gửi tự động từ hệ thống HP Edtech Center. Vui lòng không trả lời email này.</p>
                        <div class="contact-info">
                                <p><strong>Liên hệ hỗ trợ:</strong> HPEdtech.center@gmail.com | Hotline:0935846379</p>
                        </div>
                </div>
        </div>
</body>
</html>`;

    return sendMail(to, subject, html);
};

// send mail for all the users in the specific class for exam notification
export const sendExamMailToClass = async (to: string[], notificationTitle: string, message: string, courseTitle?: string) => {
        const subject = "Thông báo thi mới - HP Edtech Center";
        const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thông báo thi mới - HP Edtech Center</title>
                <style>
                                body {
                                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                                line-height: 1.6;
                                                margin: 0;
                                                padding: 0;
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #333;
                                                min-height: 100vh;
                                }
                                .container {
                                                max-width: 500px;
                                                margin: 20px auto;
                                                padding: 0;
                                                background-color: #ffffff;
                                                border-radius: 15px;
                                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                                                overflow: hidden;
                                }
                                .header {
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #ffffff;
                                                padding: 25px 20px;
                                                text-align: center;
                                                position: relative;
                                }
                                .header::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                bottom: 0;
                                                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
                                                opacity: 0.3;
                                }
                                .logo {
                                                font-size: 28px;
                                                font-weight: 700;
                                                margin-bottom: 5px;
                                                position: relative;
                                                z-index: 1;
                                }
                                .subtitle {
                                                font-size: 14px;
                                                opacity: 0.9;
                                                position: relative;
                                                z-index: 1;
                                }
                                .content {
                                                padding: 30px 25px;
                                                text-align: center;
                                }
                                h1 {
                                                color: #2d3748;
                                                font-size: 22px;
                                                font-weight: 600;
                                                margin-bottom: 20px;
                                                text-align: center;
                                }
                                p {
                                                font-size: 15px;
                                                margin-bottom: 20px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                }
                                .notification-box {
                                                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                                                border: 2px solid #e2e8f0;
                                                border-radius: 12px;
                                                padding: 25px;
                                                margin: 25px 0;
                                                position: relative;
                                                overflow: hidden;
                                }
                                .notification-box::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                height: 3px;
                                                background: linear-gradient(90deg, #ff6b35, #2196f3);
                                }
                                .notification-title {
                                                font-size: 18px;
                                                font-weight: 700;
                                                color: #2d3748;
                                                margin-bottom: 15px;
                                                text-align: center;
                                }
                                .notification-content {
                                                font-size: 15px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                                text-align: left;
                                }
                                .footer {
                                                background-color: #f7fafc;
                                                padding: 20px 25px;
                                                font-size: 12px;
                                                color: #718096;
                                                text-align: center;
                                                border-top: 1px solid #e2e8f0;
                                }
                                .highlight {
                                                font-weight: 600;
                                                color: #ff6b35;
                                }
                                .contact-info {
                                                margin-top: 15px;
                                                padding-top: 15px;
                                                border-top: 1px solid #e2e8f0;
                                                font-size: 13px;
                                }
                </style>
</head>
<body>
                <div class="container">
                                <div class="header">
                                                <div class="logo">HP Edtech Center</div>
                                                <div class="subtitle">Hệ thống quản lý giáo dục</div>
                                </div>
                                <div class="content">
                                                <h1>📚 ${courseTitle ? `${courseTitle} - Thông báo thi` : 'Thông báo thi mới'}</h1>
                                                <p>Xin chào các bạn học viên,</p>
                                                <p>Bạn có một thông báo mới về kỳ thi:</p>
                                                <div class="notification-box">
                                                                <div class="notification-title">${notificationTitle}</div>
                                                                <div class="notification-content">${message}</div>
                                                </div>
                                                <p>Vui lòng đăng nhập vào tài khoản để xem chi tiết thông tin.</p>
                                                <p>Trân trọng,<br><strong>Đội ngũ HP Edtech Center</strong></p>
                                </div>
                                <div class="footer">
                                                <p>Email này được gửi tự động từ hệ thống HP Edtech Center. Vui lòng không trả lời email này.</p>
                                                <div class="contact-info">
                                                                <p><strong>Liên hệ hỗ trợ:</strong> HPEdtech.center@gmail.com | Hotline: 0935846379</p>
                                                </div>
                                </div>
                </div>
</body>
</html>`;

        // Handle multiple recipients
        if (Array.isArray(to) && to.length > 0) {
                return sendMail(to.join(','), subject, html);
        } else {
                Logger.error('No valid recipients provided for class notification');
                return { queued: false, error: 'No valid recipients' };
        }
};

// send mail for all the users in the specific class for lecture notification
export const sendLectureMailToClass = async (to: string[], notificationTitle: string, message: string, courseTitle?: string) => {
        const subject = "Thông báo bài giảng mới - HP Edtech Center";
        const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thông báo bài giảng mới - HP Edtech Center</title>
                <style>
                                body {
                                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                                line-height: 1.6;
                                                margin: 0;
                                                padding: 0;
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #333;
                                                min-height: 100vh;
                                }
                                .container {
                                                max-width: 500px;
                                                margin: 20px auto;
                                                padding: 0;
                                                background-color: #ffffff;
                                                border-radius: 15px;
                                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                                                overflow: hidden;
                                }
                                .header {
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #ffffff;
                                                padding: 25px 20px;
                                                text-align: center;
                                                position: relative;
                                }
                                .header::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                bottom: 0;
                                                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
                                                opacity: 0.3;
                                }
                                .logo {
                                                font-size: 28px;
                                                font-weight: 700;
                                                margin-bottom: 5px;
                                                position: relative;
                                                z-index: 1;
                                }
                                .subtitle {
                                                font-size: 14px;
                                                opacity: 0.9;
                                                position: relative;
                                                z-index: 1;
                                }
                                .content {
                                                padding: 30px 25px;
                                                text-align: center;
                                }
                                h1 {
                                                color: #2d3748;
                                                font-size: 22px;
                                                font-weight: 600;
                                                margin-bottom: 20px;
                                                text-align: center;
                                }
                                p {
                                                font-size: 15px;
                                                margin-bottom: 20px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                }
                                .notification-box {
                                                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                                                border: 2px solid #e2e8f0;
                                                border-radius: 12px;
                                                padding: 25px;
                                                margin: 25px 0;
                                                position: relative;
                                                overflow: hidden;
                                }
                                .notification-box::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                height: 3px;
                                                background: linear-gradient(90deg, #ff6b35, #2196f3);
                                }
                                .notification-title {
                                                font-size: 18px;
                                                font-weight: 700;
                                                color: #2d3748;
                                                margin-bottom: 15px;
                                                text-align: center;
                                }
                                .notification-content {
                                                font-size: 15px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                                text-align: left;
                                }
                                .footer {
                                                background-color: #f7fafc;
                                                padding: 20px 25px;
                                                font-size: 12px;
                                                color: #718096;
                                                text-align: center;
                                                border-top: 1px solid #e2e8f0;
                                }
                                .highlight {
                                                font-weight: 600;
                                                color: #ff6b35;
                                }
                                .contact-info {
                                                margin-top: 15px;
                                                padding-top: 15px;
                                                border-top: 1px solid #e2e8f0;
                                                font-size: 13px;
                                }
                </style>
</head>
<body>
                <div class="container">
                                <div class="header">
                                                <div class="logo">HP Edtech Center</div>
                                                <div class="subtitle">Hệ thống quản lý giáo dục</div>
                                </div>
                                <div class="content">
                                                <h1>📖 ${courseTitle ? `${courseTitle} - Thông báo bài giảng` : 'Thông báo bài giảng mới'}</h1>
                                                <p>Xin chào các bạn học viên,</p>
                                                <p>Bạn có một thông báo mới về bài giảng:</p>
                                                <div class="notification-box">
                                                                <div class="notification-title">${notificationTitle}</div>
                                                                <div class="notification-content">${message}</div>
                                                </div>
                                                <p>Vui lòng đăng nhập vào tài khoản để xem chi tiết thông tin.</p>
                                                <p>Trân trọng,<br><strong>Đội ngũ HP Edtech Center</strong></p>
                                </div>
                                <div class="footer">
                                                <p>Email này được gửi tự động từ hệ thống HP Edtech Center. Vui lòng không trả lời email này.</p>
                                                <div class="contact-info">
                                                                <p><strong>Liên hệ hỗ trợ:</strong> HPEdtech.center@gmail.com | Hotline: 0935846379</p>
                                                </div>
                                </div>
                </div>
</body>
</html>`;

        // Handle multiple recipients
        if (Array.isArray(to) && to.length > 0) {
                return sendMail(to.join(','), subject, html);
        } else {
                Logger.error('No valid recipients provided for lecture notification');
                return { queued: false, error: 'No valid recipients' };
        }
};

// send mail for all the users in the specific class for personal notification(like absent, late, etc)
export const sendPersonalNotificationMail = async (to: string[], notificationTitle: string, message: string, courseTitle?: string) => {
        const subject = "Thông báo cá nhân - HP Edtech Center";
        const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thông báo cá nhân - HP Edtech Center</title>
                <style>
                                body {
                                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                                line-height: 1.6;
                                                margin: 0;
                                                padding: 0;
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #333;
                                                min-height: 100vh;
                                }
                                .container {
                                                max-width: 500px;
                                                margin: 20px auto;
                                                padding: 0;
                                                background-color: #ffffff;
                                                border-radius: 15px;
                                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                                                overflow: hidden;
                                }
                                .header {
                                                background: linear-gradient(90deg, #ff6b35 0%, #2196f3 100%);
                                                color: #ffffff;
                                                padding: 25px 20px;
                                                text-align: center;
                                                position: relative;
                                }
                                .header::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                bottom: 0;
                                                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
                                                opacity: 0.3;
                                }
                                .logo {
                                                font-size: 28px;
                                                font-weight: 700;
                                                margin-bottom: 5px;
                                                position: relative;
                                                z-index: 1;
                                }
                                .subtitle {
                                                font-size: 14px;
                                                opacity: 0.9;
                                                position: relative;
                                                z-index: 1;
                                }
                                .content {
                                                padding: 30px 25px;
                                                text-align: center;
                                }
                                h1 {
                                                color: #2d3748;
                                                font-size: 22px;
                                                font-weight: 600;
                                                margin-bottom: 20px;
                                                text-align: center;
                                }
                                p {
                                                font-size: 15px;
                                                margin-bottom: 20px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                }
                                .notification-box {
                                                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                                                border: 2px solid #e2e8f0;
                                                border-radius: 12px;
                                                padding: 25px;
                                                margin: 25px 0;
                                                position: relative;
                                                overflow: hidden;
                                }
                                .notification-box::before {
                                                content: '';
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                right: 0;
                                                height: 3px;
                                                background: linear-gradient(90deg, #ff6b35, #2196f3);
                                }
                                .notification-title {
                                                font-size: 18px;
                                                font-weight: 700;
                                                color: #2d3748;
                                                margin-bottom: 15px;
                                                text-align: center;
                                }
                                .notification-content {
                                                font-size: 15px;
                                                color: #4a5568;
                                                line-height: 1.6;
                                                text-align: left;
                                }
                                .footer {
                                                background-color: #f7fafc;
                                                padding: 20px 25px;
                                                font-size: 12px;
                                                color: #718096;
                                                text-align: center;
                                                border-top: 1px solid #e2e8f0;
                                }
                                .highlight {
                                                font-weight: 600;
                                                color: #ff6b35;
                                }
                                .contact-info {
                                                margin-top: 15px;
                                                padding-top: 15px;
                                                border-top: 1px solid #e2e8f0;
                                                font-size: 13px;
                                }
                </style>
</head>
<body>
                <div class="container">
                                <div class="header">
                                                <div class="logo">HP Edtech Center</div>
                                                <div class="subtitle">Hệ thống quản lý giáo dục</div>
                                </div>
                                <div class="content">
                                                <h1>👤 ${courseTitle ? `${courseTitle} - Thông báo cá nhân` : 'Thông báo cá nhân'}</h1>
                                                <p>Xin chào các bạn học viên,</p>
                                                <p>Bạn có một thông báo cá nhân:</p>
                                                <div class="notification-box">
                                                                <div class="notification-title">${notificationTitle}</div>
                                                                <div class="notification-content">${message}</div>
                                                </div>
                                                <p>Vui lòng đăng nhập vào tài khoản để thực hiện các hành động cần thiết hoặc xem thêm chi tiết.</p>
                                                <p>Trân trọng,<br><strong>Đội ngũ HP Edtech Center</strong></p>
                                </div>
                                <div class="footer">
                                                <p>Email này được gửi tự động từ hệ thống HP Edtech Center. Vui lòng không trả lời email này.</p>
                                                <div class="contact-info">
                                                                <p><strong>Liên hệ hỗ trợ:</strong> HPEdtech.center@gmail.com | Hotline: 0935846379</p>
                                                </div>
                                </div>
                </div>
</body>
</html>`;

        // Handle multiple recipients
        if (Array.isArray(to) && to.length > 0) {
                return sendMail(to.join(','), subject, html);
        } else {
                Logger.error('No valid recipients provided for lecture notification');
                return { queued: false, error: 'No valid recipients' };
        }
};


export default sendMail;
