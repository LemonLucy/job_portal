const express = require('express');
const { getAllJobs, getJobById, createJob, deleteJob, updateJob, getRelatedJobs } = require('../controllers/jobController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - company
 *         - location
 *         - url
 *       properties:
 *         title:
 *           type: string
 *           description: 채용 공고 제목
 *         company:
 *           type: string
 *           description: 회사 이름
 *         location:
 *           type: string
 *           description: 근무 지역
 *         experience:
 *           type: string
 *           description: 경력 요건
 *         requirement:
 *           type: string
 *           description: 학력 요건
 *         jobtype:
 *           type: string
 *           description: 고용 형태
 *         url:
 *           type: string
 *           description: 채용 공고 URL
 *         deadline:
 *           type: string
 *           format: date
 *           description: 지원 마감일
 *         date:
 *           type: string
 *           format: date
 *           description: 공고 게시일
 *       example:
 *         title: Backend Developer
 *         company: Example Corp
 *         location: 서울 강남구
 *         experience: 신입
 *         requirement: 대졸
 *         jobtype: 정규직
 *         url: http://example.com/job1
 *         deadline: 2024-12-01
 *         date: 2024-11-29
 */

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관련 API
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 모든 채용 공고 조회, 검색 및 필터링/정렬
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 근무 지역 필터링
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 요건 필터링
 *       - in: query
 *         name: requirement
 *         schema:
 *           type: string
 *         description: 학력 요건 필터링
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: 회사명 검색
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: 포지션 검색
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 키워드 검색 (제목 및 설명 포함)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, deadline]
 *         description: 정렬 기준 - "date" (최신순), "deadline" (마감 임박순)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *     responses:
 *       200:
 *         description: 성공적으로 채용 공고 조회
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       500:
 *         description: 서버 오류
 */
router.get('/', protect, getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 특정 채용 공고 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 특정 채용 공고 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:id', protect, getJobById);

/**
 * @swagger
 * /jobs/{id}/related:
 *   get:
 *     summary: 특정 공고와 관련된 공고 추천
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 관련 공고 추천 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 relatedJobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:id/related', protect, getRelatedJobs);


/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: 새로운 채용 공고 등록
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: 채용 공고 등록 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/', protect, createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: 특정 채용 공고 수정
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 채용 공고 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: 채용 공고 수정 성공
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.put('/:id', protect, updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: 특정 채용 공고 삭제
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 채용 공고 삭제 성공
 *       404:
 *         description: 채용 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id',protect, deleteJob);

module.exports = router;
