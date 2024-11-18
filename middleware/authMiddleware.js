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

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ error: 'Token is not valid' });
    }
};
