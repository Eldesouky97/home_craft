const express = require('express')
const { auth } = require('../middlewares/auth')

const router = express.Router()

// Get user profile
router.get('/profile', auth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  })
})

// Get user settings
router.get('/settings', auth, (req, res) => {
  res.json({
    success: true,
    settings: {
      notifications: true,
      emailUpdates: true,
      language: 'ar',
      theme: 'light'
    }
  })
})

// Update user settings
router.put('/settings', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Settings updated successfully'
  })
})

module.exports = router