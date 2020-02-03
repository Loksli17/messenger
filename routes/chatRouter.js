const chatRouter     = require('express').Router();
const chatController = require('../controllers/chatController');

chatRouter.use(function(req, res, next){
    if(req.session.userIndentity == undefined){
        res.redirect('/auth/login');
        return;
    }
    next();
})

chatRouter.all('/', chatController.actionIndex);
chatRouter.post('/more-messages', require('express').json(), chatController.moreMessages);
chatRouter.post('/upload-file', chatController.uploadFile);

module.exports = chatRouter;
