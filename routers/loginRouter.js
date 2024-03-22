// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/loginController');

const router = express.Router();

// POST /login route for user login
router.post('/login', authController.loginUser);

module.exports = router;
