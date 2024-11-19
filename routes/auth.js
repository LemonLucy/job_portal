//회원 관리 API 라우트
const express = require('express');
const { register, login, refreshToken  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User');

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refreshToken);

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

router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;

        // 현재 로그인한 사용자 정보 가져오기
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 비밀번호 변경 로직
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10); // 비밀번호 암호화 후 저장
        }

        // 프로필 정보 수정 로직
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error updating profile", details: err.message });
    }
});

router.delete('/delete', protect, async (req, res) => {
    try {
        // 사용자 ID 추출
        const userId = req.user.id;

        // 사용자 삭제
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // 추가: 사용자와 연관된 데이터 삭제 (예: 지원 내역, 북마크 등)
        // await Application.deleteMany({ userId });
        // await Bookmark.deleteMany({ userId });

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting account" });
    }
});



module.exports = router;
