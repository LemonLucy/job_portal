//회원 관리 API 라우트
const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, async (req, res) => {
    try {
        console.log("Fetching user profile with ID:", req.user.id);
        const user = await User.findById(req.user.id).select('-password'); // 비밀번호 제외
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving profile' });
    }
});


module.exports = router;
