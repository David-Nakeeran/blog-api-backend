const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');


// Handle comment POST
exports.commentCreate = [
    // Validate and sanitise fields
    body("text")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Comment text must be specified"),
    // Process request after validation and santisation
    asyncHandler(async(req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                error: errors.array(),
            });
        }
            const comment = new Comment({
                text: req.body.text,
                author: req.user.id,
                post: req.params.id
            })

            // Need error handling function

            const savedComment = await comment.save();

            return res.status(201).json({
                status: "success",
                message: "Comment created successfully",
                comment: savedComment,
            })

    })
];


// Handle user deleting own comment
exports.commentUserDelete = asyncHandler(async(req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    
    // Replace with error handling function
    if(!comment) {
        return res.status(404).json({
            status: 'error',
            message: "comment not found"
        })
    }
    
    if(comment.author.toString() !== req.user.id) {
        return res.status(403).json({
            status: "error",
            message: "You can only delete your own comments"
        })
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
        status: 'success',
        message: 'Comment deleted successfully'
    })
})

exports.commentAdminDelete = asyncHandler(async(req, res, next) => {
    if(!req.user.admin) {
        return res.status(403).json({
            status: 'error',
            message: 'Access denied. Admin only'
        })
    }

    const comment = await Comment.findByIdAndDelete(req.params.commentId);

    // Replace with error handling function
    if(!comment) {
        return res.status(404).json({
            status: 'error',
            message: 'Comment not found'
        })
    }

    res.status(200).json({
        status: 'success',
        messgae: 'Comment deleted successfully'
    })

})