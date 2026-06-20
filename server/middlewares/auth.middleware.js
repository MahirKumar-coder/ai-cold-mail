const User = require('../models/User')
const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split(' ')[1]?.trim()
            if (!token || token.split('.').length !== 3) {
                return res.status(401).json({ message: 'Not authorized, invalid token format' })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const userId = decoded.id || decoded._id

            req.user = await User.findById(userId).select('-password')
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' })
            }

            next()
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' })
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' })
    }
}

module.exports = { protect }
