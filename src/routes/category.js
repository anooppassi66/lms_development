const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Admin-only create/update/delete
router.post('/', authMiddleware, requireRole('admin'), [
	require('express-validator').body('category_name').isLength({ min: 1 }).withMessage('category_name required')
], require('../middleware/validate'), categoryController.createCategory);
router.put('/:id', authMiddleware, requireRole('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, requireRole('admin'), categoryController.deleteCategory);

// Public reads (list and get)
router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);

module.exports = router;
