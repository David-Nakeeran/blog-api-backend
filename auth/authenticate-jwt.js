const {verifyToken, extractToken, generateToken} = require('./jwt-ultils');
const {createCustomError} = require('../utils/errorHelpers')

const authenticateToken = async function(req, res, next) {
    try {
        const token = extractToken(req);
        const decoded = await verifyToken(token, process.env.TOKEN_SECRET);

        req.user = decoded;
        next();

    }   catch(err) {
            next(next(createCustomError('Authentication failed', 401))  )    
    }
             
    
};

const authenticateAdminToken = async function(req, res, next) {
    try {
        const token = extractToken(req);
        const decoded = await verifyToken(token, process.env.TOKEN_SECRET);

        if(!decoded.admin) {
            return next(createCustomError('Access denied. Admin only', 403))  
        }

        req.user = decoded;
        next();

    }   catch(err) {
            next(next(createCustomError('Authentication failed', 401))  )    
    }
};

module.exports = {authenticateToken, authenticateAdminToken};