const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/auth.middleware')
const aiController = require('../controllers/ai.controller')

router.post('/generate', protect, aiController.generateEmail)
router.get('/history', protect, aiController.getEmailHistory)

module.exports = router