const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.all('/login', authController.actionLogin);
authRouter.all('/signup', authController.actionSignup);
authRouter.get('/logout', authController.actionLogout);

module.exports = authRouter;
