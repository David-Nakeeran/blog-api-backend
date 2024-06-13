const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const {authenticateAdminToken} = require('../auth/authenticate-jwt')

// Create post 
router.post("/", authenticateAdminToken, postController.postCreate);

// Get post detail
router.get("/:id", postController.postDetail);

// Create post comment
router.post("/:id/comments", authenticateAdminToken, commentController.commentCreate);

module.exports = router;