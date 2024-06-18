const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const {authenticateAdminToken, authenticateToken} = require('../auth/authenticate-jwt')

// Display all posts Admin
router.get("/", authenticateAdminToken, postController.postAdminList)

// Create post 
router.post("/", authenticateAdminToken, postController.postCreate);

// Get post detail
router.get("/:id", postController.postDetail);

// Admin delete post
router.delete("/:id", authenticateAdminToken, postController.postAdminDelete)

// Admin update isPublished post
router.patch("/:id", authenticateAdminToken, postController.postAdminPublish);

// Admin update post content
router.put("/:id", authenticateAdminToken, postController.postAdminUpdatePost);

// Create post comment
router.post("/:id/comments", authenticateToken, commentController.commentCreate);

// User delete own comment
router.delete("/:id/comments/:commentId", authenticateToken, commentController.commentUserDelete)

// Admin delete any comment
router.delete("/:id/comments/:commentId", authenticateAdminToken, commentController.commentAdminDelete)


module.exports = router;