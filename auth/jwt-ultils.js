const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.TOKEN_SECRET;

function generateToken(user) {
    const payload = {id: user._id}
    return jwt.sign(payload, SECRET_KEY, {expiresIn: '1m'})
};


module.exports = generateToken;