// send mail using nodemailer
import nodemailer from "nodemailer";
const sendMail = async (to: string, subject: string, body: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        text: body
    };
    await transporter.sendMail(mailOptions);
}

export default sendMail;



