const {verifyToken, extractToken} = require('./jwt-ultils');

async function authenticateToken(req, res, next) {
    try {
        const token = extractToken(req);
        const decoded = await verifyToken(token);

        req.user = decoded;
        next();
    }   catch(err) {
            res.status(401).json({
                status: 'error',
                message: err.message
            })
            
    }
};

async function authenticateAdminToken(req, res, next) {
    try {
        const token = extractToken(req);
        const decoded = await verifyToken(token, process.env.TOKEN_SECRET);

        if(!decoded.admin) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Admin only.'
            });
        }

        req.user = decoded;
        next();

    }   catch(err) {
            res.status(401).json({
                status: 'error',
                message: err.message
            })
            
    }
};

module.exports = {authenticateToken, authenticateAdminToken};