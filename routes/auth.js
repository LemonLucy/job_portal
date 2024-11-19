// 회원 관리 API 라우트
const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: 사용자 이메일
 *         password:
 *           type: string
 *           description: 사용자 비밀번호
 *       example:
 *         email: user@example.com
 *         password: password123
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 새로운 사용자 이름
 *         email:
 *           type: string
 *           description: 새로운 사용자 이메일
 *         currentPassword:
 *           type: string
 *           description: 현재 비밀번호
 *         newPassword:
 *           type: string
 *           description: 새 비밀번호
 *       example:
 *         name: New Name
 *         email: new@example.com
 *         currentPassword: oldpassword
 *         newPassword: newpassword123
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원 관리 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원 가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 성공적으로 회원가입 완료
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 성공적으로 로그인
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 유효한 리프레시 토큰
 *             example:
 *               refreshToken: abc123xyz
 *     responses:
 *       200:
 *         description: 새 액세스 토큰 발급
 *       400:
 *         description: 리프레시 토큰 누락
 *       404:
 *         description: 잘못된 리프레시 토큰
 *       500:
 *         description: 서버 오류
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 프로필 정보 반환
 *       404:
 *         description: 사용자 정보 없음
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 사용자 프로필 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: 성공적으로 프로필 수정
 *       400:
 *         description: 비밀번호 불일치 또는 잘못된 요청
 *       404:
 *         description: 사용자 정보 없음
 *       500:
 *         description: 서버 오류
 */
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

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: 사용자 계정 삭제
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 계정 삭제
 *       404:
 *         description: 사용자 정보 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/delete', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting account" });
    }
});

module.exports = router;
