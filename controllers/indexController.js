const mongoose  = require('./../lib/database/mongoose');
//models
const ChatModel = require('./../models/ChatModel');
const UserModel = require('./../models/UserModel');


exports.actionIndex = async (req, res) => {

    //let userChats       = await ChatModel.find({['users.' + req.session.userIndentity._id]: req.session.userIndentity._id}).sort('').limit(3),
    let userChats = [],
        countActiveChat = 0;

    userChats = await ChatModel.aggregate()
        .match({["users." + req.session.userIndentity._id] : String(req.session.userIndentity._id)} )
        .project({
            users   :  '$users',
            lastMes :  { $slice  : ['$messages', -1]},
            messages : {
                $filter : {
                    input : "$messages",
                    as    : "message",
                    cond : {$and : [
                        {$eq: ['$$message.checked' , false]},
                        {$ne: ['$$message.userId'  ,  String(req.session.userIndentity._id)]}
                    ]}
                }
            }
        })

    if(!userChats.length){
        res.render('index', {
            error: true,
        });
        return;
    }


    for(let i = 0; i < userChats.length; i++){
         userChats[i].lastMes = userChats[i].lastMes[0];

        if(userChats[i].messages.length != 0){
            userChats[i].unreadedMessages = userChats[i].messages.length;
        }

        if(userChats[i].lastMes != undefined){
            userChats[i].lastMes.user = await UserModel.findOne({_id: userChats[i].lastMes.userId});
            userChats[i].isActive = true;
            countActiveChat++;
        }else{
            userChats[i].isActive = false;
        }

        for(let key in userChats[i].users){
            if(key != req.session.userIndentity._id){
                userChats[i].link = key;
            }
        }
    }

    //ФИКС
    console.log(userChats.length);

    if(userChats.length > 1){
        userChats.sort((a, b) => {
            let dateA = new Date(a.lastMes.date + 'T' + a.lastMes.time),
                dateB = new Date(b.lastMes.date + 'T' + b.lastMes.time);

            console.log(a.lastMes.date, dateA);
            return dateB - dateA;
        });
    }


    res.render('index', {
        error: countActiveChat ? false : true,
        chats: userChats,
    });
};


exports.moreChat = async (req, res) => {

}
