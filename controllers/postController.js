const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

// Display all POSTS 
exports.postList = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find({}, "comment")
    .populate("comment")
    .exec()

    res.status(200).json({
        status: "success",
        posts: allPosts
    })
})

// Handle article POST
exports.postCreate = [
    // Validate and sanitise fields
    body("title")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Title must be specified"),
    body("text")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Post text must be specified"),
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
            // Create a Post object with escaped and trimmed data
            console.log(req.user); 
            const post = new Post({
                title: req.body.title,
                text: req.body.text,
                author: req.user._id,
            })
            const savedPost = await post.save();

            return res.status(201).json({
                status: "success",
                message: "Post created successfully",
                post: savedPost,
            })
        }   catch(err) {
                return next(err)
        }
    })
];


