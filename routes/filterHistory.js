const express = require('express');
const { saveFilterHistory, getUserFilterHistory, deleteFilterHistory } = require('../controllers/filterHistoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FilterHistory
 *   description: 채용 공고 필터 기록 API
 */

/**
 * @swagger
 * /history:
 *   post:
 *     summary: 필터 기록 저장
 *     tags: [FilterHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filters:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *                 description: 사용자가 설정한 필터 조건
 *             example:
 *               filters:
 *                 location: "Seoul"
 *                 experience: "2 years"
 *                 jobtype: "Full-time"
 *     responses:
 *       201:
 *         description: 필터 기록 저장 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/', protect, saveFilterHistory);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: 특정 사용자의 필터 기록 조회
 *     tags: [FilterHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 필터 기록 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                     description: 사용자 ID
 *                   filters:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *                     description: 필터 조건
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: 사용자 필터 기록을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/', protect, getUserFilterHistory);

/**
 * @swagger
 * /history/{id}:
 *   delete:
 *     summary: 필터 기록 삭제
 *     tags: [FilterHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 필터 기록 ID
 *     responses:
 *       200:
 *         description: 필터 기록 삭제 성공
 *       404:
 *         description: 필터 기록을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', protect, deleteFilterHistory);

module.exports = router;
