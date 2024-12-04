const express = require('express');
const { createCompany, getAllCompanies, getCompanyById } = require('../controllers/companyController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: 회사 관리 API
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: 모든 회사 조회
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: 회사 목록 반환
 */
router.get('/', getAllCompanies);

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: 회사 생성
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *               establishment_date:
 *                 type: string
 *               ceo_name:
 *                 type: string
 *               industry:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회사 생성 성공
 */
router.post('/', createCompany);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: 특정 회사 정보 및 리뷰 조회
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 회사 ID
 *     responses:
 *       200:
 *         description: 특정 회사 정보 반환
 *       404:
 *         description: 회사를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get('/:id', getCompanyById);

module.exports = router;
