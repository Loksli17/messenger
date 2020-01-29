const mongoose  = require('./../lib/database/mongoose');
//models
const ChatModel = require('./../models/ChatModel');

exports.actionIndex = async function(req, res){

    let userChats = await ChatModel.find({});

    res.render('index');
};
