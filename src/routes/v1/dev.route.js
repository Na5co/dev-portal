const express = require('express');
const devController = require('../../controllers/dev.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/seed-db', auth(), devController.seedDatabase);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dev
 *   description: Development routes
 */

/**
 * @swagger
 * /dev/seed-db:
 *   post:
 *     summary: Seed the database
 *     description: Seeds the database with initial data (for development purposes).
 *     tags: [Dev]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *          $ref: '#/components/responses/Forbidden'
 */
