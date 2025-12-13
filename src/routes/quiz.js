const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Admin create quiz
router.post('/', authMiddleware, requireRole('admin'), quizController.createQuiz);

// Admin update quiz
router.put('/:quizId', authMiddleware, requireRole('admin'), quizController.updateQuiz);

// Admin delete (deactivate) quiz
router.delete('/:quizId', authMiddleware, requireRole('admin'), quizController.deleteQuiz);

// List quizzes
router.get('/', authMiddleware, quizController.listQuizzes);

// Get quiz details
router.get('/:quizId', authMiddleware, quizController.getQuiz);

// User attempt quiz
router.post('/:quizId/attempt', authMiddleware, quizController.attemptQuiz);

module.exports = router;
