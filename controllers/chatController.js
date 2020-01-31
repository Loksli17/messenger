const UserModel = require('./../models/UserModel');
const ChatModel = require('./../models/ChatModel');
const DateModel = require('./../lib/date');

var connections = [];

async function saveMessage(data, socketIo){
    let dataToSave = {};
    let cheaked = false;
    let chat = await ChatModel.findOne({'_id' : data.chatId});

    for (let i = 0; i < connections.length; i++){
        if (connections[connections.indexOf(socketIo)].opponentId == connections[i].userId){
            cheaked = true;
            break;
        }
    }

    dataToSave = {
        text    : data.message ,
        date    : data.date,
        time    : data.time,
        userId  : data.userId,
        cheaked : cheaked,
    }

    chat.messages.push(dataToSave);
    await chat.save();
    return;
}

exports.actionIndex = async function(req, res){
    let chat            = {},
        opponent        = {},
        queryIdOpponent = '',
        countMessage    = 20;

    queryIdOpponent = String(req.query.id);

    opponent = await UserModel.findOne({'_id' : req.query.id}, function(err){
        if(err){
            res.status(404);
            res.render('server/404')
            return;
        }
    });
    if (opponent == null){
        res.status(404);
        res.render('server/404')
        return;
    }

    connections.push(req.session.userIndentity);

    chat = await ChatModel.findOne({$and: [
        {["users." + req.session.userIndentity._id] : req.session.userIndentity._id},
        {["users." + req.query.id] : queryIdOpponent}
    ]});

    chat.messages = chat.messages.slice(chat.messages.length - countMessage, chat.messages.length);

    if(chat == null){
        chat = new ChatModel({
            messages : [],
            users    : {
                [req.session.userIndentity._id] : req.session.userIndentity._id,
                [req.query.id]                  : queryIdOpponent,
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
                chat.messages[i].currentUser = true;
                chat.messages[i].img = req.session.userIndentity.img;
            }else{
                chat.messages[i].userName = opponent.name.firstName + " " +
                    opponent.name.secondName;
                chat.messages[i].img = opponent.img;
            }
        }
    }

    chat.userId     = req.session.userIndentity._id;
    chat.userName   = req.session.userIndentity.name.firstName + " " +
        req.session.userIndentity.name.secondName;
    chat.opponentId = req.query.id;
    chat.img        = req.session.userIndentity.img;

    connections.push(chat);

    res.render('chat/chat', {
        messages    : chat.messages,
        opponent    : opponent,
        countMessage: countMessage,
    });
}

exports.respondConnect = async function(socketIo){
    let today = new Date(),
        data  = {},
        chat  = {},
        time  = '',
        date  = '';

    chat = connections[connections.length-1];
    connections[connections.length-1]            = socketIo;
    connections[connections.length-1].userId     = chat.userId;
    connections[connections.length-1].userName   = chat.userName;
    connections[connections.length-1].chatId     = chat._id;
    connections[connections.length-1].opponentId = chat.opponentId;
    connections[connections.length-1].img        = chat.img;

    socketIo.join(chat._id);
    socketIo.on('chat message', function(message){
        today = new Date();

        data = {
           message : String(message),
           date    : DateModel.formatDbDate(today),
           time    : DateModel.formatDbTime(today),
           userName: String(chat.userName),
           userId  : connections[connections.indexOf(socketIo)].userId,
           chatId  : chat._id,
           img     : chat.img,
        };
        if(data.message != ""){
            saveMessage(data, socketIo);
            socketIo.in(connections[connections.indexOf(socketIo)].chatId).emit('chat message', data);
            socketIo.emit('chat message', data);
        }
    });

    socketIo.on('disconnect',function () {
        console.log(connections[connections.indexOf(socketIo)].userName + ' disconnected');
        connections.splice(connections.indexOf(socketIo), 1);
    })
}
