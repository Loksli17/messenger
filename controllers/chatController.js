const UserModel = require('./../models/UserModel');
const ChatModel = require('./../models/ChatModel');
const DateModel = require('./../lib/date');

var connections = [];

async function saveMessage(data){
    let dataToSave = {};
    let chat = await ChatModel.findOne({'_id' : data.chatId});

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


exports.actionIndex = async function(req, res){
    let chat     = {};
    let opponent = {};

    connections.push(req.session.userIndentity);
    chat = await ChatModel.findOne({$and: [
        {["users." + req.session.userIndentity._id] : req.session.userIndentity._id},
        {["users." + req.query.id] : req.query.id}
    ]});
    if(chat == null){
        chat = new ChatModel({
            messages : [],
            users    : {
                [req.session.userIndentity._id] : req.session.userIndentity._id,
                [req.query.id]                  : req.query.id,
            },
        });
      await chat.save();
    }

    if(chat.messages.length != 0){
        opponent = await UserModel.findOne({'_id' : req.query.id});
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
    let today = new Date(),
        data  = {},
        chat  = {},
        time  = '',
        date  = '';

    chat = connections[connections.length - 1];
    connections[connections.length - 1] = socketIo;
    connections[connections.length - 1].userId   = chat.userId;
    connections[connections.length - 1].userName = chat.userName;
    connections[connections.length - 1].chatId   = chat._id;

    socketIo.join(chat._id);
    socketIo.on('chat message', function(message){
        today = new Date();

        data = {
           message : message + "",
           date    : DateModel.formatDbDate(today),
           time    : DateModel.formatDbTime(today),
           userName: chat.userName + "",
           userId  : connections[connections.indexOf(socketIo)].userId,
           chatId  : chat._id,
        };
        if(data.message != ""){
            saveMessage(data);
            socketIo.in(connections[connections.indexOf(socketIo)].chatId).emit('chat message', data);
            socketIo.emit('chat message', data);
        }
    });

    socketIo.on('disconnect',function () {
        console.log(connections[connections.indexOf(socketIo)].userName + 'disconnected');
        connections.splice(connections.indexOf(socketIo), 1);
    })
}
