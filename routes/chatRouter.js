const chatRouter     = require('express').Router();
const chatController = require('../controllers/chatController');

chatRouter.use(function(req, res, next){
    if(req.session.userIndentity == undefined){
        res.redirect('/auth/login');
        return;
    }
    next();
})

chatRouter.all('/',chatController.Index);

module.exports = chatRouter;
