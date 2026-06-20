const express = require('express')
const authRoutes = require('./routes/authRoutes')
const aiAuth = require('./routes/aiRoutes')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
connectDB()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/auth', authRoutes)
app.use('/api/ai', aiAuth)

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
    
})
