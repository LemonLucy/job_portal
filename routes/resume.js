const express = require('express');
const {createResume, getResumes, updateResume, deleteResume} =require('../controllers/resumeControlloer')
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: 이력서 관리 API
 */

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: 이력서 목록 조회
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 이력서 목록 반환
 */
router.get('/', protect, getResumes);

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: 이력서 생성
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 이력서 제목
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     school:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     fieldOfStudy:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     company:
 *                       type: string
 *                     position:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: 성공적으로 생성된 이력서
 */
router.post('/', protect, createResume);

/**
 * @swagger
 * /resumes/{id}:
 *   put:
 *     summary: 이력서 수정
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 이력서 ID
 *     responses:
 *       200:
 *         description: 성공적으로 수정된 이력서
 */
router.put('/:id', protect, updateResume);

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: 이력서 삭제
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 이력서 ID
 *     responses:
 *       200:
 *         description: 성공적으로 삭제된 이력서
 */
router.delete('/:id', protect, deleteResume);

module.exports = router;
