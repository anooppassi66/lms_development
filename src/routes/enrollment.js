const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const enrollmentController = require('../controllers/enrollmentController');

router.post('/:courseId/enroll', authMiddleware, enrollmentController.enroll);
router.get('/me', authMiddleware, enrollmentController.listUserEnrollments);
router.post('/:courseId/complete-lesson', authMiddleware, [
	require('express-validator').body('chapterId').isLength({ min: 1 }),
	require('express-validator').body('lessonId').isLength({ min: 1 }),
	require('../middleware/validate')
], enrollmentController.markLessonComplete);
router.get('/:courseId/progress', authMiddleware, enrollmentController.getProgress);
router.get('/:courseId/resume', authMiddleware, enrollmentController.getNextLesson);

module.exports = router;
