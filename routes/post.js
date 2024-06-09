const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const {authenticateAdminToken} = require('../auth/authenticate-jwt')

// Create post 
router.post("/", authenticateAdminToken, postController.postCreate);

module.exports = router;