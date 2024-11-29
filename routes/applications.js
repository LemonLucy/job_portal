const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // 사용자 인증 미들웨어
const { 
    createApplication, 
    getApplications, 
    cancelApplication 
} = require('../controllers/applicationController');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 관리 API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원하기
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 지원할 Job의 ID
 *               resume:
 *                 type: string
 *                 description: 이력서 URL (선택사항)
 *             required:
 *               - jobId
 *             example:
 *               jobId: "6482c48f3e84c11111111111"
 *               resume: "http://example.com/resume.pdf"
 *     responses:
 *       201:
 *         description: 지원 성공
 *       400:
 *         description: 중복 지원
 *       404:
 *         description: 지원할 Job을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.post('/', protect, createApplication);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [applied, cancelled]
 *         description: 지원 상태 필터링
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 날짜 정렬 기준
 *     responses:
 *       200:
 *         description: 지원 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   job:
 *                     type: string
 *                     description: 지원한 Job ID
 *                   status:
 *                     type: string
 *                     description: 지원 상태
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: 지원 날짜
 *       500:
 *         description: 서버 오류
 */
router.get('/', protect, getApplications);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 취소
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 지원 ID
 *     responses:
 *       200:
 *         description: 지원 취소 성공
 *       404:
 *         description: 지원 정보를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', protect, cancelApplication);

module.exports = router;
