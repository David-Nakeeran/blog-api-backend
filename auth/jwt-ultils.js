const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(user) {
    const payload = {id: user._id, admin: user.admin}
    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: '1m'})
};

async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded;
    }   catch(err) {
        throw new Error('Token verification failed');
    };
};

function extractToken(req, res, next) {
    
        const bearerHeader = req.headers['authorization'];
        if(!bearerHeader) {
            throw new Error('Authorization header is missing');
        }
        const token = bearerHeader.split(' ')[1];
        if(!token) {
            throw new Error('Token is missing')
        }

        return token
};

module.exports = {generateToken, verifyToken, extractToken};