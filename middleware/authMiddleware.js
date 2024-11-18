//JWT 인증 미들웨어
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized, no token provided' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        console.log("Decoded User:", decoded);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
