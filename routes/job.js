const express = require('express');
const { getAllJobs, getJobById, createJob, deleteJob, updateJob } = require('../controllers/jobController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관련 API
 */

// 모든 채용 공고 조회
router.get('/', getAllJobs);

// 특정 채용 공고 조회
router.get('/:id', getJobById);

// 채용 공고 등록
router.post('/', createJob);

// 채용 공고 수정
router.put('/:id', updateJob);

// 채용 공고 삭제
router.delete('/:id', deleteJob);

module.exports = router;
