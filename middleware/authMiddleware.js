const jwt = require('jsonwebtoken'); // jwt 모듈 가져오기
const { isBlacklisted } = require('../utils/blacklist');
require('dotenv').config();

exports.protect = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log("No Authorization header");
        return res.status(401).json({ error: 'Unauthorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("No token found in Authorization header");
        return res.status(401).json({ error: 'Unauthorized, no token provided' });
    }

    console.log("Token received for verification:", token); // 추가
    if (isBlacklisted(token)) {
        console.log("Token is blacklisted:", token); // 추가
        return res.status(401).json({ error: 'Token has been invalidated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // 추가
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ error: 'Token is not valid' });
    }
};
