const express = require('express');
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 회사 리뷰 API
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: 모든 리뷰 조회
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: 리뷰 목록 반환
 */
router.get('/', getReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: 리뷰 생성
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: 회사 ID
 *               rating:
 *                 type: number
 *                 description: 평점
 *               review:
 *                 type: string
 *                 description: 리뷰 내용
 *             example:
 *               company: "634d9c452b87a93b74c2f8ab"
 *               rating: 4
 *               review: "Great company culture and support"
 *     responses:
 *       201:
 *         description: 리뷰 생성 성공
 */
router.post('/', protect, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: 리뷰 삭제
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       404:
 *         description: 리뷰를 찾을 수 없음
 */
router.delete('/:id', protect, deleteReview);

module.exports = router;
