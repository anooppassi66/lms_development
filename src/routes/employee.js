const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// employee dashboard - only employees
router.get('/dashboard', authMiddleware, requireRole('employee'), employeeController.dashboard);

module.exports = router;
