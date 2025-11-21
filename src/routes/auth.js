const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authController = require('../controllers/authController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// public
router.post('/login', [body('email').isEmail(), body('password').isLength({ min: 1 }), validate], authController.login);
// seed admin (dev) - call once
router.post('/seed-admin', authController.seedAdmin);

// admin-only create employee
router.post('/register', authMiddleware, requireRole('admin'), [body('email').isEmail(), validate], authController.register);

// edit profile for logged in user
router.put('/profile', authMiddleware, authController.editProfile);

module.exports = router;
