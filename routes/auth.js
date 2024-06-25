const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Post sign up new user
router.post("/signup", authController.signupPost);

// Post login user
router.post("/login", authController.loginPost);

router.post("/logout", authController.logout)

module.exports = router;