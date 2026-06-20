const express = require('express')
const authRoutes = require('./routes/authRoutes')
const aiAuth = require('./routes/aiRoutes')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
app.set('trust proxy', 1)
connectDB()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000'
]
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL)
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''))
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, '') + '/')
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('render.com')) {
            callback(null, true)
        } else {
            console.warn(`CORS warning: Allow origin ${origin} dynamically`)
            callback(null, true)
        }
    },
    credentials: true
}))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/auth', authRoutes)
app.use('/api/ai', aiAuth)

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
    
})
