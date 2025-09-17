const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bankingValidation } = require('../../validations');
const { bankingController } = require('../../controllers');

const router = express.Router();

router.get(
  '/fraud-detection/:identifier',
  auth(),
  validate(bankingValidation.getFraudScore),
  bankingController.getFraudScore
);
router.get(
  '/credit-score/:identifier',
  auth(),
  validate(bankingValidation.getCreditScore),
  bankingController.getCreditScore
);
router.get(
  '/transaction-history/:identifier',
  auth(),
  validate(bankingValidation.getTransactionHistory),
  bankingController.getTransactionHistory
);

router.patch(
  '/fraud-detection/:identifier',
  auth('manageUsers'),
  validate(bankingValidation.setFraudStatus),
  bankingController.setFraudStatus
);

router.patch(
  '/credit-score/:identifier',
  auth('manageUsers'),
  validate(bankingValidation.setCreditScore),
  bankingController.setCreditScore
);

router.post(
  '/loan-application/:identifier',
  auth(),
  validate(bankingValidation.applyForLoan),
  bankingController.applyForLoan
);

router.patch(
  '/loan-application/:identifier/review',
  auth('manageUsers'),
  validate(bankingValidation.reviewLoanApplication),
  bankingController.reviewLoanApplication
);

router.get(
  '/loan-applications',
  auth('manageUsers'),
  validate(bankingValidation.getLoanApplications),
  bankingController.getLoanApplications
);

router.put(
  '/users/:identifier/profile',
  auth(),
  validate(bankingValidation.updateUserProfile),
  bankingController.updateUserProfile
);

router.post(
  '/users/:identifier/assess-risk',
  auth('manageUsers'),
  validate(bankingValidation.assessRisk),
  bankingController.assessRisk
);

router
  .route('/assessments')
  .get(auth('manageUsers'), validate(bankingValidation.getRiskAssessments), bankingController.getRiskAssessments);

router
  .route('/loans/active')
  .get(auth('manageUsers'), validate(bankingValidation.getActiveLoans), bankingController.getActiveLoans);

router
  .route('/loan-decision/:identifier')
  .get(auth(), validate(bankingValidation.getLoanDecision), bankingController.getLoanDecision);

router
  .route('/risk-assessment/:identifier')
  .post(auth('manageUsers'), validate(bankingValidation.assessRisk), bankingController.assessRisk);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Banking
 *   description: Banking services like fraud detection, credit score, and transaction history.
 */

/**
 * @swagger
 * /banking/fraud-detection/{identifier}:
 *   get:
 *     summary: Get fraud score for a user
 *     tags: [Banking]
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
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /banking/fraud-detection/{identifier}:
 *   patch:
 *     summary: Set fraud status for a user
 *     tags: [Banking]
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
 * /banking/credit-score/{identifier}:
 *   get:
 *     summary: Get credit score for a user
 *     tags: [Banking]
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
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /banking/credit-score/{identifier}:
 *   patch:
 *     summary: Set credit score for a user
 *     tags: [Banking]
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
 * /banking/transaction-history/{identifier}:
 *   get:
 *     summary: Get transaction history for a user
 *     tags: [Banking]
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
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /banking/loan-application/{identifier}:
 *   post:
 *     summary: Apply for a loan
 *     tags: [Banking]
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
 *               amount:
 *                 type: number
 *             example:
 *               amount: 5000
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /banking/loan-application/{identifier}/review:
 *   patch:
 *     summary: Review a loan application (Admin)
 *     description: Allows an admin to approve or decline a loan application that is pending review.
 *     tags: [Banking]
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
 * /banking/loan-applications:
 *   get:
 *     summary: Get all loan applications (Admin)
 *     description: Allows an admin to retrieve all loan applications, with options for filtering and pagination.
 *     tags: [Banking]
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
 *         default: 10
 *         description: Maximum number of applications.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
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
 * /banking/users/{identifier}/profile:
 *   put:
 *     summary: Update a user's financial profile
 *     description: Allows a user to submit or update their detailed personal and financial information.
 *     tags: [Banking]
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
 *               address:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zipCode: { type: string }
 *               employmentStatus:
 *                 type: string
 *                 enum: [employed, unemployed, self-employed, student]
 *               monthlyIncome:
 *                 type: number
 *               monthlyDebt:
 *                 type: number
 *             example:
 *               address:
 *                 street: "123 Main St"
 *                 city: "Anytown"
 *                 state: "CA"
 *                 zipCode: "12345"
 *               employmentStatus: "employed"
 *               monthlyIncome: 5000
 *               monthlyDebt: 1500
 *     responses:
 *       "200":
 *         description: OK. The user profile has been updated.
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /banking/users/{identifier}/assess-risk:
 *   post:
 *     summary: Assess the financial risk of a user (Admin)
 *     description: Allows an admin to trigger a financial risk assessment for a specific user. This must be done before a user can apply for a loan.
 *     tags: [Banking]
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
