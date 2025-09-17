const express = require('express');
const devController = require('../../controllers/dev.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/seed-db', auth(), devController.seedDatabase);

module.exports = router;
