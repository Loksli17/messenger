const settingsRouter = require('express').Router();
const settingsController = require('../controllers/settingsController');

settingsRouter.all('/edit-user', settingsController.actionEditUser);

module.exports = settingsRouter;
