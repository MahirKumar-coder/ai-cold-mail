const axios = require('axios')
const EmailHistory = require('../models/EmailHistory')

function parseGeneratedContent(content) {
    if (!content) {
        throw new Error('AI response was empty.')
    }

    const cleanedContent = content
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim()

    try {
        return JSON.parse(cleanedContent)
    } catch (error) {
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }

        throw new Error('AI response was not valid JSON.')
    }
}

async function generateEmail(req, res) {
    const { prompt } = req.body
    if (!prompt) {
        return res.status(400).json({
            message: 'Please enter the prompt.'
        })
    }
    if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({
            message: 'GROQ_API_KEY is not configured.'
        })
    }

    try {
        const systemMessage = `
You are an expert outreach assistant specialized in writing high-converting cold emails and LinkedIn DMs.

Your tone is professional, concise, conversational, and non-spammy.
Focus on value first. Use a clear CTA.
`;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: `Generate outreach content for this goal: "${prompt}".

Guidelines:
1. Cold Email: Include a catchy subject line, professional greeting, value-driven body, and clear CTA. Keep it under 150 words.
2. LinkedIn DM: Conversational, direct, and under 300 characters. Do not use a subject line.

Return only valid JSON in this format:
{
  "email_subject": "...",
  "email_body": "...",
  "linkedin_dm": "...",
  "follow_up_email": "..."
}`
                }
            ],
            max_tokens: 1024,
            temperature: 0.7,
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        const generatedContent = parseGeneratedContent(response.data?.choices?.[0]?.message?.content)
        const subject = generatedContent.email_subject
        const emailBody = generatedContent.email_body
        const linkedInDm = generatedContent.linkedin_dm
        const followUpEmail = generatedContent.follow_up_email

        if (!subject || !emailBody || !linkedInDm || !followUpEmail) {
            return res.status(502).json({
                message: 'AI response did not include all required fields.'
            })
        }

        const emailHistory = await EmailHistory.create({
            user: req.user._id,
            prompt,
            subject,
            emailBody,
            linkedInDm,
            followUpEmail
        })
        return res.status(200).json({
            subject, emailBody, linkedInDm, followUpEmail
        })
    } catch (error) {
        const message = error.response?.data?.error?.message || error.message
        return res.status(500).json({
            message: 'Error generating email', error: message
        })
    }
}

async function getEmailHistory(req, res) {
    try {
        const history = await EmailHistory.find({ user: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json(history)
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching email history', error: error.message
        })
    }
}

module.exports = { generateEmail, getEmailHistory }

// 2:07:09
