const User = require('./../models/UserModel');
const Chat = require('./../models/ChatModel');

var connections = [];

async function saveMessage(data){
    let dataToSave = {};
    let chat = await Chat.findOne({'_id' : data.chatId});

    dataToSave = {
        text    : data.message ,
        date    : data.date,
        time    : data.time,
        userId  : data.userId
    }

    chat.messages.push(dataToSave);
    await chat.save();
    return;
}

exports.Index = async function(req, res){
    let chat      = {};
    let opponent  = {}

    connections.push(req.session.userIndentity);
    chat = await Chat.findOne({["users."+req.session.userIndentity._id] : req.session.userIndentity._id});
    if(chat == null){
        chat = new Chat({
            messages : [],
            users    : {
                [req.session.userIndentity._id] : req.session.userIndentity._id,
                [req.query.id]                  : req.query.id,
            },
        });
      await chat.save();
    }

    if(chat.messages.length != 0){
        opponent = await User.findOne({'_id' : req.query.id})
        console.log(opponent);
        for(let i = 0; i < chat.messages.length; i++){
            if(chat.messages[i].userId == req.session.userIndentity._id){
                chat.messages[i].userName =  req.session.userIndentity.name.firstName + " " +
                    req.session.userIndentity.name.secondName;
            }else{
                chat.messages[i].userName = opponent.name.firstName + " " +
                    opponent.name.secondName;
            }
        }
    }

    chat.userId = req.session.userIndentity._id;
    chat.userName = req.session.userIndentity.name.firstName + " " +
        req.session.userIndentity.name.secondName;

    connections.push(chat);
    res.render('chat/chat', {
        messages : chat.messages,
    });
}

exports.respondConnect = async function(socketIo){
    let today = new Date();
    let data = {};
    let chat = {};
    let time = '';
    let date = '';

    chat = connections[connections.length-1];
    connections[connections.length-1] = socketIo;
    connections[connections.length-1].userId    = chat.userId;
    connections[connections.length-1].userName  = chat.userName;
    connections[connections.length-1].chatId    = chat._id;

    socketIo.join(chat._id);
    socketIo.on('chat message',  function (message) {
        today = new Date();
        date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        data = {
           message : message+"",
           date    : date +"",
           time    : time+ "",
           userName: chat.userName+"",
           userId  : connections[connections.indexOf(socketIo)].userId,
           chatId  : chat._id,
        };
        if(data.message != ""){
            saveMessage(data);
            socketIo.in(connections[connections.indexOf(socketIo)].chatId).emit('chat message',data);
            socketIo.emit('chat message',data);
        }
    })
}
