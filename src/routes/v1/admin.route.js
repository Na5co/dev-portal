const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { adminValidation } = require('../../validations');
const { adminController } = require('../../controllers');

const router = express.Router();

router
  .route('/fraud-status/:identifier')
  .post(auth('manageUsers'), validate(adminValidation.setFraudStatus), adminController.setFraudStatus);

router
  .route('/credit-score/:identifier')
  .post(auth('manageUsers'), validate(adminValidation.setCreditScore), adminController.setCreditScore);

router
  .route('/loan-application/:identifier/review')
  .patch(auth('manageUsers'), validate(adminValidation.reviewLoanApplication), adminController.reviewLoanApplication);

router
  .route('/risk-assessment/:identifier')
  .post(auth('manageUsers'), validate(adminValidation.assessRisk), adminController.assessRisk);

router
  .route('/loan-applications')
  .get(auth('getLoanApplications'), validate(adminValidation.getLoanApplications), adminController.getLoanApplications);

router
  .route('/assessments')
  .get(auth('manageUsers'), validate(adminValidation.getRiskAssessments), adminController.getRiskAssessments);

router.route('/loans/active').get(auth('manageUsers'), validate(adminValidation.getActiveLoans), adminController.getActiveLoans);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only banking operations
 */

/**
 * @swagger
 * /admin/fraud-status/{identifier}:
 *   post:
 *     summary: Set fraud status for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [fraud, not_fraud]
 *             example:
 *               status: fraud
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/credit-score/{identifier}:
 *   post:
 *     summary: Set credit score for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *             example:
 *               score: 750
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/loan-application/{identifier}/review:
 *   patch:
 *     summary: Review a loan application
 *     description: Allows an admin to approve or decline a loan application that is pending review.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               decision:
 *                 type: string
 *                 enum: [approved, declined]
 *                 description: The decision on the loan application.
 *             example:
 *               decision: "approved"
 *     responses:
 *       "200":
 *         description: OK. The loan application status has been updated.
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/risk-assessment/{identifier}:
 *   post:
 *     summary: Assess the financial risk of a user
 *     description: Allows an admin to trigger a financial risk assessment for a specific user. This must be done before a user can apply for a loan.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or Email
 *     responses:
 *       "200":
 *         description: OK. The risk assessment has been completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId: { type: string }
 *                 riskLevel: { type: string, enum: [low, medium, high] }
 *                 recommendation: { type: string, enum: [proceed, proceed_with_caution, deny] }
 *                 assessment:
 *                   type: object
 *                   properties:
 *                     creditScoreCheck: { type: string }
 *                     dtiRatioCheck: { type: string }
 *                     fraudFlags: { type: "array", items: { type: "string" } }
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/loan-applications:
 *   get:
 *     summary: Get all loan applications
 *     description: Allows an admin to retrieve all loan applications, with options for filtering and pagination.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_review, approved, declined]
 *         description: Filter applications by their status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of applications.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK. A list of loan applications.
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /admin/assessments:
 *   get:
 *     summary: Get all risk assessments
 *     description: Allows an admin to retrieve all risk assessments, with options for filtering and pagination.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_assessment, pending_review, approved, declined]
 *         description: Filter assessments by their status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of assessments.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK. A list of risk assessments.
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /admin/loans/active:
 *   get:
 *     summary: Get all active loans
 *     description: Allows an admin to retrieve all active loans, with options for pagination.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of loans.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK. A list of active loans.
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
