const express = require('express');
const router = express.Router()
const refreshController = require('../controllers/refresh');

router.post('/user/login', refreshController.loginUser);
router.delete('/user/logout', refreshController.logoutUser);
router.post('/user/token', refreshController.createToken)

module.exports = router;