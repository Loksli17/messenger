const chatRouter     = require('express').Router();
const chatController = require('../controllers/chatController');

const crypto         = require('crypto');
const config         = require('../config');

chatRouter.use(function(req, res, next){
    if(req.session.userIndentity == undefined){
        res.redirect('/auth/login');
        return;
    }
    next();
});

//multer
const multer = require("multer");
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/message');
    },
    filename: (req, file, cb) => {
        let type    = file.mimetype.split('/'),
            rand    = 1 - 0.5 + Math.random() * (999999999 - 1 + 1),
            textMes = '';

        rand = String(rand);
        rand += req.session.userIndentity._id;
        text = crypto.createHash('sha256', config.user.passSecret).update(rand).digest('hex')

        cb(null, text + '.' +  type[1].toUpperCase());
    }
});
const upload = multer({storage: storageConfig});


chatRouter.all('/', chatController.actionIndex);
chatRouter.post('/more-messages', require('express').json(), chatController.moreMessages);
chatRouter.post('/upload-file', upload.single('file'), require('express').json(), chatController.uploadFile);

module.exports = chatRouter;
