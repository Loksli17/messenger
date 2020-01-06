const express = require('express');
const indexController = require('../controllers/indexController');

const indexRouter = express.Router();
indexRouter.get('/', indexController.actionIndex);

module.exports = indexRouter;
