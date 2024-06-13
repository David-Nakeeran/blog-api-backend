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

        try {
            // Create a Comment object with escaped and trimmed data
            console.log(req.user.id);

            const comment = new Comment({
                text: req.body.text,
                author: req.user.id,
                post: req.params.id
            })
            const savedComment = await comment.save();

            return res.status(201).json({
                status: "success",
                message: "Comment created successfully",
                comment: savedComment,
            })
        }   catch(err) {
                return next(err)
        }
    })
];
