const searchRouter = require('express').Router();
const searchController = require('../controllers/searchController');

searchRouter.post('/action',searchController.actionIndex);
searchRouter.all('/',searchController.index);

module.exports = searchRouter;
