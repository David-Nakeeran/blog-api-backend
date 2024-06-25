const jwt = require('jsonwebtoken');
require('dotenv').config();
const asyncHandler = require('express-async-handler');
const {createCustomError} = require('../utils/errorHelpers');


// Generates a JWT token for a user or admin
const generateToken = function(user) {
    const payload = {id: user._id, admin: user.admin}
    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '15m'})
};

// Verify JWT token
const verifyToken = async function(token, secret) {
    try {
        const decoded = await jwt.verify(token, secret);
        return decoded;
    }   catch(err) {
        return (createCustomError('Token verification failed', 401));
    };
};

// Extracts JWT from the authorization header
const extractToken = asyncHandler(async(req, res, next) =>  {
    
        const bearerHeader = req.headers['authorization'];
        if(!bearerHeader) {
            return next(createCustomError('Authorization header is missing', 400));
        }
        const token = bearerHeader.split(' ')[1];
        if(!token) {
            return next(createCustomError('Token is missing', 400));
        }

        return token
});

module.exports = {generateToken, verifyToken, extractToken};