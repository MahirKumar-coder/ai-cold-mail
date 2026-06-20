const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')

async function Register(req, res) {
    try {
        const { userName, email, password } = req.body
        if (!userName || !email || !password) {
            return res.status(401).json({
                message: 'Please enter your details'
            })
        } 

        if (password.length < 6) {
            return res.status(402).json({
                message: 'Please enter password greater than 6 character.'
            })
        }
        
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(403).json({
                message: 'User already exist.'
            })
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000)
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        const user = await User.create({
            userName,
            name: userName,
            email,
            password,
            otp,
            otpExpiry
        }) 

        try {
            await sendEmail({
                to: email,
                subject: 'Your OTP code for AI ColdMail Generator',
                text: `Your code is ${otp}, and valid for only 10 minutes.`
            })
        } catch (error) {
            console.log('Error sending otp.', error);
            await User.findByIdAndDelete(user._id)
            return res.status(500).json({
                message: 'OTP email could not be sent. Please check email configuration and try again.',
                error: error.message
            })
        }

        return res.status(201).json({
            message: 'User registered successfully. OTP sent to your email.',
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something Went wrong', 
            error: error.message
        })
    }
}

async function verifyOTP(req, res) {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({
                message: 'Please enter the details.'
            })
        }
        const user = await User.findOne({ email }).select('+otp +otpExpiry')
        if (!user) {
            return res.status(401).json({
                message: 'User not found!'
            })
        }
        if (user.isVerified) {
            return res.status(400).json({
                message: 'User is already verified.'
            })
        }
        if (user.otp !== otp) {
            return res.status(403).json({
                message: 'Otp is not valid.'
            })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(404).json({
                message: 'OTP Expire.'
            })
        }
        user.isVerified = true
        await user.save()
        return res.status(201).json({
            message: 'OTP verified.'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error verfying otp', error: error.message
        })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).json({
                message: 'Please enter the details.'
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(402).json({
                message: 'No'
            })
        }
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Account not verified.'
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(404).json({
                message: 'Invalid Credentials.'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            message: 'User login successfully.',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                token
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong.',
            error: error.message
        })
    }
}

module.exports = { Register, verifyOTP, login }
