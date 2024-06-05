const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Post sign up new user
router.post("/signup", authController.signupPost);