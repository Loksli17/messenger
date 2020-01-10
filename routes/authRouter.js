const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.all('/login', authController.actionLogin);
authRouter.get('/signup', authController.actionSignup);

module.exports = authRouter;
