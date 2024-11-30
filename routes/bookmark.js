const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  toggleBookmark,
  getBookmarks,
  filterBookmarks,
  searchBookmarks,
  getRelatedJobsFromJobId
} = require('../controllers/bookmarkController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       required:
 *         - user
 *         - job
 *       properties:
 *         user:
 *           type: string
 *           description: 북마크를 추가한 사용자 ID
 *         job:
 *           type: string
 *           description: 북마크된 채용 공고 ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 북마크 생성 시간
 *       example:
 *         user: 647d0c2c2f5b2c0012345678
 *         job: 647d0d3e2f5b2c0012345679
 *         createdAt: 2024-11-30T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 API
 */

/**
 * @swagger
 * /bookmarks/{jobId}:
 *   post:
 *     summary: 북마크 추가/제거 (토글)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 북마크할 공고 ID
 *     responses:
 *       200:
 *         description: 북마크가 제거되었습니다.
 *       201:
 *         description: 북마크가 추가되었습니다.
 *       404:
 *         description: 해당 공고를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
router.post('/:jobId', protect, toggleBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 사용자별 북마크 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: >
 *           페이지 번호. 
 *           기본값은 1입니다.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: >
 *           페이지당 항목 수. 
 *           기본값은 10입니다.
 *     responses:
 *       200:
 *         description: 북마크 목록 반환
 *       500:
 *         description: 서버 오류
 */
router.get('/', protect, getBookmarks);

/**
 * @swagger
 * /bookmarks/filter:
 *   get:
 *     summary: 북마크 필터링
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: >
 *           근무 위치를 필터링합니다.
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: >
 *           경력 요건을 필터링합니다.
 *       - in: query
 *         name: salary
 *         schema:
 *           type: integer
 *         description: >
 *           최소 급여 조건을 필터링합니다.
 *       - in: query
 *         name: stack
 *         schema:
 *           type: string
 *         description: >
 *           기술 스택을 필터링합니다.
 *     responses:
 *       200:
 *         description: 필터링된 북마크 목록 반환
 *       500:
 *         description: 서버 오류
 */
router.get('/filter', protect, filterBookmarks);

/**
 * @swagger
 * /bookmarks/search:
 *   get:
 *     summary: 북마크 검색
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: >
 *           검색 키워드를 입력하여 북마크를 검색합니다.
 *     responses:
 *       200:
 *         description: 검색 결과 반환
 *       500:
 *         description: 서버 오류
 */
router.get('/search', protect, searchBookmarks);

/**
 * @swagger
 * /bookmarks/{jobId}/related:
 *   get:
 *     summary: 특정 Job ID를 기반으로 관련 공고 추천
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: 관련 공고를 추천할 Job ID
 *     responses:
 *       200:
 *         description: 관련 공고 목록 반환
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:jobId/related', protect, getRelatedJobsFromJobId);

module.exports = router;
