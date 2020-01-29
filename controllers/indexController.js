const mongoose  = require('./../lib/database/mongoose');
//models
const ChatModel = require('./../models/ChatModel');
const UserModel = require('./../models/UserModel');


exports.actionIndex = async (req, res) => {

    let userChats       = await ChatModel.find({['users.' + req.session.userIndentity._id]: req.session.userIndentity._id}).limit(2),
        countActiveChat = 0;

    if(!userChats.length){
        res.render('index', {
            error: true,
        });
        return;
    }

    for(let i = 0; i < userChats.length; i++){
        userChats[i].lastMes = userChats[i].messages[userChats[i].messages.length - 1];


        if(userChats[i].lastMes != undefined){
            userChats[i].lastMes.user = await UserModel.findOne({_id: userChats[i].lastMes.userId});
            userChats[i].isActive = true;
            countActiveChat++;
        }else{
            userChats[i].isActive = false;
        }

        delete userChats[i].users;
        delete userChats[i].messages;

        for(let key in userChats[i].users){
            if(key != req.session.userIndentity._id){
                userChats[i].link = key;
            }
        }

        console.log();
    }

    res.render('index', {
        error: countActiveChat ? false : true,
        chats: userChats,
    });
};
