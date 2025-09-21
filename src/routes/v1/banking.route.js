const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const authorizeBanking = require('../../middlewares/authorizeBanking');
const { bankingValidation } = require('../../validations');
const { bankingController } = require('../../controllers');

const router = express.Router();

router
  .route('/fraud-score/:identifier')
  .get(auth(), authorizeBanking, validate(bankingValidation.getFraudScore), bankingController.getFraudScore);

router
  .route('/credit-score/:identifier')
  .get(auth(), authorizeBanking, validate(bankingValidation.getCreditScore), bankingController.getCreditScore);

router
  .route('/transaction-history/:identifier')
  .get(auth(), authorizeBanking, validate(bankingValidation.getTransactionHistory), bankingController.getTransactionHistory);

router
  .route('/loan-application/:identifier')
  .post(auth(), authorizeBanking, validate(bankingValidation.applyForLoan), bankingController.applyForLoan);

router
  .route('/profile/:identifier')
  .put(auth(), authorizeBanking, validate(bankingValidation.updateUserProfile), bankingController.updateUserProfile);

router
  .route('/loan-decision/:identifier')
  .get(auth(), authorizeBanking, validate(bankingValidation.getLoanDecision), bankingController.getLoanDecision);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Banking
 *   description: Banking services like fraud detection, credit score, and transaction history.
 */

/**
 * @swagger
 * /banking/fraud-score/{identifier}:
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
 * /banking/profile/{identifier}:
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
 * /banking/loan-decision/{identifier}:
 *   get:
 *     summary: Get loan decision for a user
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
