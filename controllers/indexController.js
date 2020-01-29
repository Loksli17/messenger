const mongoose  = require('./../lib/database/mongoose');
//models
const ChatModel = require('./../models/ChatModel');

exports.actionIndex = async (req, res) => {
    console.log(mongoose.version);

    let userChats = await ChatModel.find({['users.' + req.session.userIndentity._id]: req.session.userIndentity._id});
    console.log(userChats);

    res.render('index');
};
