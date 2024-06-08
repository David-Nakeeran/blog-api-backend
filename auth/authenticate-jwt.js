const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    const token = bearerHeader.split(' ')[1];

    if(!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    })
}

module.exports = authenticateToken;