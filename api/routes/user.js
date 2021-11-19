const express = require('express');
const router = express.Router()
const userController = require('../controllers/user');

router.post('/user', userController.createUser);
router.get('/user/:id', userController.validateToken, userController.getUser);
router.post('/user/auth', userController.authenticateUser);

module.exports = router;