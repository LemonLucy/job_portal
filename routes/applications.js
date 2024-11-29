const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // 사용자 인증 미들웨어
const { 
    createApplication, 
    getApplications, 
    cancelApplication 
} = require('../controllers/applicationController');

/**
 * 지원 정보 생성 (지원하기)
 * POST /applications
 */
router.post('/', protect, createApplication);

/**
 * 사용자 지원 내역 조회
 * GET /applications
 */
router.get('/', protect, getApplications);

/**
 * 지원 취소
 * DELETE /applications/:id
 */
router.delete('/:id', protect, cancelApplication);

module.exports = router;
