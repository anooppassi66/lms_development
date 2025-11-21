const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const certificateController = require('../controllers/certificateController');

router.get('/', authMiddleware, certificateController.listCertificates);

module.exports = router;
