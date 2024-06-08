const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const authenticateToken = require('../auth/authenticate-jwt')

// Create post 
router.post("/", authenticateToken, postController.postCreate);

module.exports = router;