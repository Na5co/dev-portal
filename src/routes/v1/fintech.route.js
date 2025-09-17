
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { fintechValidation } = require('../../validations');
const { fintechController } = require('../../controllers');

const router = express.Router();

router.get(
  '/fraud-detection/:userId',
  auth(),
  validate(fintechValidation.getFraudScore),
  fintechController.getFraudScore
);
router.get(
  '/credit-score/:userId',
  auth(),
  validate(fintechValidation.getCreditScore),
  fintechController.getCreditScore
);
router.get(
  '/transaction-history/:userId',
  auth(),
  validate(fintechValidation.getTransactionHistory),
  fintechController.getTransactionHistory
);

router.patch(
  '/fraud-detection/:userId',
  auth('manageUsers'),
  validate(fintechValidation.setFraudStatus),
  fintechController.setFraudStatus
);

router.patch(
  '/credit-score/:userId',
  auth('manageUsers'),
  validate(fintechValidation.setCreditScore),
  fintechController.setCreditScore
);

router.post(
  '/loan-application/:userId',
  auth(),
  validate(fintechValidation.applyForLoan),
  fintechController.applyForLoan
);

router.patch(
  '/loan-application/:userId/review',
  auth('manageUsers'),
  validate(fintechValidation.reviewLoanApplication),
  fintechController.reviewLoanApplication
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Fintech
 *   description: Fintech services like fraud detection, credit score, and transaction history.
 */

/**
 * @swagger
 * /fintech/fraud-detection/{userId}:
 *   get:
 *     summary: Get fraud score for a user
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/fraud-detection/{userId}:
 *   patch:
 *     summary: Set fraud status for a user
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/credit-score/{userId}:
 *   get:
 *     summary: Get credit score for a user
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/credit-score/{userId}:
 *   patch:
 *     summary: Set credit score for a user
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/transaction-history/{userId}:
 *   get:
 *     summary: Get transaction history for a user
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/loan-application/{userId}:
 *   post:
 *     summary: Apply for a loan
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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
 * /fintech/loan-application/{userId}/review:
 *   patch:
 *     summary: Review a loan application (Admin)
 *     description: Allows an admin to approve or decline a loan application that is pending review.
 *     tags: [Fintech]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose loan application is being reviewed.
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
