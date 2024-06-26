// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/register', UserController.registerUser);

module.exports = router;
