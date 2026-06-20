const axios = require('axios');

const sendEmail = async (options) => {
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const brevoApiKey = process.env.BREVO_API_KEY?.trim();
    const fromEmail = process.env.EMAIL_FROM?.trim() || 'onboarding@resend.dev';
    const fromName = process.env.EMAIL_FROM_NAME?.trim() || 'AI Cold Mail Generator';

    if (!resendApiKey && !brevoApiKey) {
        throw new Error('Either RESEND_API_KEY or BREVO_API_KEY must be configured in .env.');
    }

    if (resendApiKey) {
        try {
            const response = await axios.post(
                'https://api.resend.com/emails',
                {
                    from: `${fromName} <${fromEmail}>`,
                    to: [options.to],
                    subject: options.subject,
                    text: options.text,
                    html: options.html || `<p>${options.text}</p>`
                },
                {
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Email Sent Successfully via Resend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error Sending Email via Resend: ', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message);
        }
    } else if (brevoApiKey) {
        try {
            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                {
                    sender: {
                        name: fromName,
                        email: fromEmail
                    },
                    to: [
                        {
                            email: options.to
                        }
                    ],
                    subject: options.subject,
                    textContent: options.text,
                    htmlContent: options.html || `<p>${options.text}</p>`
                },
                {
                    headers: {
                        'api-key': brevoApiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Email Sent Successfully via Brevo:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error Sending Email via Brevo: ', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message);
        }
    }
};

module.exports = sendEmail;
