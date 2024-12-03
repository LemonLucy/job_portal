const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  toggleBookmark,
  getBookmarks,
  filterBookmarks,
  searchBookmarks,
  getRelatedJobsFromJobId,
} = require('../controllers/bookmarkController');

const router = express.Router();

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 추가/제거 (토글)
 *     tags: [Bookmarks]
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
 *                 description: 북마크할 Job ID
 *             example:
 *               jobId: "674efdef3aa2d93610ad1710"
 *     responses:
 *       200:
 *         description: 북마크가 제거되었습니다.
 *       201:
 *         description: 북마크가 추가되었습니다.
 */
router.post('/', protect, toggleBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 북마크 목록 조회
 *     tags: [Bookmarks]
 */
router.get('/', protect, getBookmarks);

/**
 * @swagger
 * /bookmarks/filter:
 *   get:
 *     summary: 북마크 필터링
 *     tags: [Bookmarks]
 */
router.get('/filter', protect, filterBookmarks);

/**
 * @swagger
 * /bookmarks/search:
 *   get:
 *     summary: 북마크 검색
 *     tags: [Bookmarks]
 */
router.get('/search', protect, searchBookmarks);

/**
 * @swagger
 * /bookmarks/{jobId}/related:
 *   get:
 *     summary: 특정 Job ID를 기반으로 관련 공고 추천
 *     tags: [Bookmarks]
 */
router.get('/:jobId/related', protect, getRelatedJobsFromJobId);

module.exports = router;
