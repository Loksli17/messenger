const express = require('express');
const indexController = require('../controllers/indexController');

const indexRouter = express.Router();

indexRouter.get('/', indexController.actionIndex);
indexRouter.post('/more-chat', indexController.moreChat);

module.exports = indexRouter;
