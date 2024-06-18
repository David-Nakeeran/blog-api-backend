const Post = require('../models/post');
const Comment = require('../models/comment');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

/* To DO
1. Change all reference of .populate('author') with - .populate({
                    path: 'author',
                    select: 'firstName surname fullName'
            })
2. Remove try catch blocks
3. Create helper function/ middleware for repetitive error handling
*/

// Display all POSTS
exports.postList = asyncHandler(async(req, res, next) => {
    
    const allPublishedPosts = await Post.find({isPublished: true}, "author")
            .populate({
                    path: 'author',
                    select: 'firstName surname fullName'
            })
            .sort({createdAt: -1})
            .exec()
    
    if(!allPublishedPosts) {
        const err = new Error('Posts not found');
        err.status = 404;
        return next(err)
    }

    res.status(200).json({
        status: "success",
        posts: allPublishedPosts
    })
    
    
})

// Display all POSTS Admin
exports.postAdminList = asyncHandler(async(req, res, next) => {
    
    const allPosts = await Post.find({}, "author")
        .populate({
            path: 'author',
            select: 'firstName surname fullName'
        })
        .sort({createdAt: -1})
        .exec()

    if(!allPosts) {
        const err = new Error('Posts not found');
        err.status = 404;
        return next(err)
    }
        
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
                author: req.user.id,
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

// Display detail page for specific Post
exports.postDetail = asyncHandler(async(req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'author',
            select: "firstName surname fullName"
        }).exec();

        if(!post) {
        return next(err)
    }

        const comments = await Comment.find({post: post._id})
            .populate({
                path: 'author',
                select: 'firstName surname fullName'
            })
            .sort({createdAt: 1})
            .exec();
        
        res.status(200).json({
                status: "success",
                post: post,
                comments: comments
        })

    }   catch(err) {
        return next(err)
    }
})

// Delete specific post
exports.postAdminDelete = asyncHandler(async(req, res, next) => {
    // Find post to ensure it exists
    const post = await Post.findById(req.params.id);

    if(!post) {
        return res.status(404).json({
            status: "Error",
            message: "Post not found"
        });
    }

    // Delete all comments associated with the specific post
    await Comment.deleteMany({post: post._id});

    // Delete the post
    await Post.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: "Success",
        message: "Post and associated comments deleted successfully"
    });
});

// Admin publish and unpublish posts
exports.postAdminPublish = asyncHandler(async(req, res, next) => {

    const post = await Post.findByIdAndUpdate(req.params.id, {isPublished: req.body.isPublished}, {new: true})

    if(!post) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }

    res.status(200).json({
        status: 'success',
        message: 'Post status updated successfully',
        post: post
    })
});


exports.postAdminUpdatePost = [
    // Validate and sanitise fields
    body("title")
        .optional()
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Title must be specified"),
    body("text")
        .optional()
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

        const post = await Post.findById(req.params.id);

        if(!post) {
            const err = new Error('Post not found');
            err.status = 404;
            return next(err);
        }

            // Post update
            const updatePostData = {
                title: req.body.title || post.title,
                text: req.body.text || post.text,
                author: {
                    _id: req.user.id,
                    firstName: req.user.firstName,
                    surname: req.user.surname
                }, 
            }

            // Update Post
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatePostData, {new: true})
                .populate({
                    path: 'author',
                    select: '_id firstName surname fullName'
                })
                .exec();

            if(!updatedPost) {
                const err = new Error('Post not found');
                err.status = 404;
                return next(err)
            }

            return res.status(200).json({
                status: "success",
                message: "Post updated successfully",
                post: updatedPost,
            })
        
    })
];