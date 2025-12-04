const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin-only employee management
router.get('/employees', authMiddleware, requireRole('admin'), adminController.listEmployees);
router.post('/employees/:employeeId/deactivate', authMiddleware, requireRole('admin'), adminController.deactivateEmployee);

// Admin-only quiz management
router.post('/quizzes/:quizId/deactivate', authMiddleware, requireRole('admin'), adminController.deactivateQuiz);

module.exports = router;
