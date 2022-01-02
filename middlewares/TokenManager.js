const jwt = require("jsonwebtoken");

/**
 * TokenManager for middleware authorization
 * 
 */
const generateToken = async (userData) => {
    const jwtPayload = userData;
    const jwtData = {
        expiresIn: process.env.JWT_TIMEOUT_DURATION 
    }
    const secret = process.env.JWT_SECRET;
    userData.token = jwt.sign(jwtPayload, secret, jwtData);
    return userData;
}

module.exports = [
    generateToken,
]