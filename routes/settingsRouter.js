const settingsRouter = require('express').Router();
const settingsController = require('../controllers/settingsController');

//multer
const multer = require("multer");
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/user-photo');
    },
    filename: (req, file, cb) => {
        let type = file.mimetype.split('/');
        cb(null, req.session.userIndentity._id + '.' +  type[1].toUpperCase());
    }
});
const upload = multer({storage: storageConfig});

//actions
settingsRouter.all('/edit-user', settingsController.actionEditUser);
settingsRouter.post('/upload-file', upload.single('file') ,settingsController.actionUploadFile);

module.exports = settingsRouter;
