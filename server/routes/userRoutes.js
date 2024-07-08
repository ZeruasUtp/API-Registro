// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.delete('/:id', userController.delete);
router.patch('/:id', userController.update);
router.get('/:id', userController.getById);
router.get('/', userController.getAll);

module.exports = router;