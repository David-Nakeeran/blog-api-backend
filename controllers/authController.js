const User = require("../models/user");
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../auth/jwt-ultils');
const passport = require('../auth/passport-config');

// Handle signup Post
exports.signupPost = [
    // Validate and sanitise fields
    body("firstName")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("First name must be specified"),
    body("surname")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Surname must be specified"),
    body("username")
        .isEmail()
        .escape()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters")
        .matches(/\d/)
        .withMessage("Password should have at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password should have at least one special character"),
    body("passwordConfirmation")
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Password confirmation does not match password");
            }
        return true;  
        }),
asyncHandler(async(req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            error: errors.array(),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
   
        const user = new User({
            firstName: req.body.firstName,
            surname: req.body.surname,
            username: req.body.username,
            password: hashedPassword,
        })
        const savedUser = await user.save();
        res.status(200).json({
            status: "success",
            message: "User registered successfully",
        })
    }   catch(err) {
        return next(err)
    }
})
];

// Handle login POST
exports.loginPost = [
    // Validate and sanitise fields
    body("username")
        .isEmail()
        .escape()
        .withMessage("Username must be entered")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({min: 1})
        .withMessage("Password must be entered"),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                error: errors.array(),
            })
        }
        
        passport.authenticate('local', (err, user, info) => {
            if(err) {
                return next(err)
            }
            if(!user) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication failed"
                })
            }
            
            try {
                const token = generateToken(user);
                return res.status(200).json({
                status: "success",
                message: "Authentication successful",
                token: token,
                })
            }   catch(err) {
                next(err);
            }
            
        })(req, res, next);
    }),
];
