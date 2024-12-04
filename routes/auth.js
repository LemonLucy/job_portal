const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    register,
    login,
    updatePassword,
    updateProfile,
    getProfile,
    refreshToken,
    deleteAccount,
} = require('../controllers/authController');

const router = express.Router();

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
router.post('/refresh',protect, refreshToken);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 사용자 프로필 및 비밀번호 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 사용자 이름 (선택)
 *               email:
 *                 type: string
 *                 description: 사용자 이메일 (선택)
 *               oldPassword:
 *                 type: string
 *                 description: 기존 비밀번호 (비밀번호 변경 시 필수)
 *               newPassword:
 *                 type: string
 *                 description: 새 비밀번호 (비밀번호 변경 시 필수)
 *             example:
 *               name: "New Name"
 *               email: "newemail@example.com"
 *               oldPassword: "currentpassword"
 *               newPassword: "newpassword"
 *     responses:
 *       200:
 *         description: 성공적으로 프로필 또는 비밀번호 수정
 *       400:
 *         description: 잘못된 요청 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Old password is incorrect"
 *       404:
 *         description: 사용자 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error updating profile"
 */
router.put('/profile', protect, updateProfile);

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
 *         description: 성공적으로 프로필 조회
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: 사용자 이름
 *                 email:
 *                   type: string
 *                   description: 사용자 이메일
 *               example:
 *                 name: John Doe
 *                 email: johndoe@example.com
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized, no token provided"
 *       404:
 *         description: 사용자 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving profile"
 */
router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /auth:
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
router.delete('/', protect, deleteAccount);

module.exports = router;
