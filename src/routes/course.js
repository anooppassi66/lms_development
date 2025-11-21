const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// simple disk storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage });

// Admin course management
router.post('/', authMiddleware, requireRole('admin'), [
  require('express-validator').body('title').isLength({ min: 1 }).withMessage('title required'),
  require('express-validator').body('category').isLength({ min: 1 }).withMessage('category required')
], require('../middleware/validate'), courseController.createCourse);
router.put('/:id', authMiddleware, requireRole('admin'), courseController.editCourse);
router.delete('/:id', authMiddleware, requireRole('admin'), courseController.deactivateCourse);
router.get('/', authMiddleware, requireRole('admin'), courseController.listCourses);
router.get('/:id', authMiddleware, requireRole('admin'), courseController.getCourse);

// Chapters & lessons (admin)
router.post('/:courseId/chapters', authMiddleware, requireRole('admin'), [
  require('express-validator').body('title').isLength({ min: 1 }).withMessage('chapter title required')
], require('../middleware/validate'), courseController.addChapter);
router.post('/:courseId/chapters/:chapterId/lessons', authMiddleware, requireRole('admin'), upload.single('video'), [
  // lesson name optional if video provided
  require('express-validator').body('name').optional().isLength({ min: 1 })
], require('../middleware/validate'), courseController.addLesson);

// Public course listing and details (employees)
router.get('/public/list', courseController.listCourses);
// optionalAuth will populate req.user if token provided
const { optionalAuth } = require('../middleware/auth');
router.get('/public/:id', optionalAuth, courseController.getCoursePublic);

module.exports = router;
