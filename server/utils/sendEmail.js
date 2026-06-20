const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    const emailUser = process.env.EMAIL_USER?.trim()
    const emailPass = process.env.EMAIL_PASS?.trim()

    if (!emailUser || !emailPass) {
        throw new Error('EMAIL_USER and EMAIL_PASS must be configured in .env.')
    }

    if (!emailUser.includes('@')) {
        throw new Error('EMAIL_USER must be a full email address.')
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    })

    try {
        const mailOptions = {
            from: emailUser,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: `<p>${options.text}</p>`
        }
        await transporter.sendMail(mailOptions)
        console.log('Email Sent Successfully');
    } catch (error) {
        console.log('Error Sending Email: ', error);
        throw error
    }
}

module.exports = sendEmail;
