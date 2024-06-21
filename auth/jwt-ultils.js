const jwt = require('jsonwebtoken');
require('dotenv').config();
const asyncHandler = require('express-async-handler');
const {createCustomError} = require('../utils/errorHelpers');

const generateToken = function(user) {
    const payload = {id: user._id, admin: user.admin}
    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1m'})
};

const verifyToken = async function(token) {
    try {
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded;
    }   catch(err) {
        return (createCustomError('Token verification failed', 401));
    };
};

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