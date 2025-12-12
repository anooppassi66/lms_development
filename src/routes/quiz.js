const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Admin create quiz
router.post('/', authMiddleware, requireRole('admin'), quizController.createQuiz);

// List quizzes
router.get('/', authMiddleware, quizController.listQuizzes);

// Get quiz details
router.get('/:quizId', authMiddleware, quizController.getQuiz);

// User attempt quiz
router.post('/:quizId/attempt', authMiddleware, quizController.attemptQuiz);

module.exports = router;
