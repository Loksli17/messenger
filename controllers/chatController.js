const UserModel = require('./../models/UserModel');
const ChatModel = require('./../models/ChatModel');
const DateModel = require('./../lib/date');

var connections = [];


async function saveMessage(data, socketIo){
    let dataToSave = {};
    let checked = false;
    let chat = await ChatModel.findOne({'_id' : data.chatId});

    for (let i = 0; i < connections.length; i++){
        if (connections[connections.indexOf(socketIo)].opponentId == connections[i].userId){
            checked = true;
            break;
        }
    }

    dataToSave = {
        text    : data.message ,
        dateTime: data.date + 'T' + data.time,
        userId  : data.userId,
        checked : checked,
    }

    if(typeof data.file == 'object'){
        dataToSave['file'] = {
            type: '',
            name: '',
        };
        dataToSave.file.type = data.file.type;
        dataToSave.file.name = data.file.name;
    }

    chat.messages.push(dataToSave);
    await chat.save();
    return;
}


exports.actionIndex = async function(req, res){

    let chat                = {};
    let opponent            = {};
    let queryIdOpponent     = '';
    let uncheackedMessages  = [],
        countMessage        = 20;

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

    chat = await ChatModel.findOne({$and: [
        {["users." + req.session.userIndentity._id] : String(req.session.userIndentity._id)},
        {["users." + req.query.id] : queryIdOpponent}
    ]});

    // chat.messages = chat.messages.slice(chat.messages.length - countMessage, chat.messages.length);

    if(chat == null){
        chat = new ChatModel({
            messages : [],
            users    : {
                [req.session.userIndentity._id] : String(req.session.userIndentity._id),
                [req.query.id]                  : queryIdOpponent,
            },
        });
      await chat.save();
  }else {
      uncheackedMessages = await ChatModel.update({$and: [
          {["users." + req.session.userIndentity._id] : req.session.userIndentity._id},
          {["users." + req.query.id] : queryIdOpponent},
          {messages : {$elemMatch : {$and: [{userId :queryIdOpponent}, {checked : false}]}}},
      ]},{
          $set : {'messages.$[].checked' : true}
      });


      console.log(uncheackedMessages);
  }

    if(chat.messages.length != 0){
        opponent = await UserModel.findOne({'_id' : req.query.id});
        for(let i = 0; i < chat.messages.length; i++){
            if(chat.messages[i].userId == req.session.userIndentity._id){
                chat.messages[i].userName =  req.session.userIndentity.name.firstName + " " + req.session.userIndentity.name.secondName;
                chat.messages[i].currentUser = true;
                chat.messages[i].imgUser = req.session.userIndentity.img;
            }else{
                chat.messages[i].userName = opponent.name.firstName + " " + opponent.name.secondName;
                chat.messages[i].imgUser = opponent.img;
            }
            //дата для сообщения
            var date = new Date(chat.messages[i].dateTime);
            chat.messages[i].date = DateModel.formatView(date);
            chat.messages[i].time = DateModel.formatDbTime(date);
            //init type
            if(chat.messages[i].file != undefined){
                switch(chat.messages[i].file.type){
                    case 'video':
                        chat.messages[i].video = chat.messages[i].file.name;
                        break;
                    case 'img':
                        chat.messages[i].img = chat.messages[i].file.name;
                        break;
                    case 'text':
                        chat.messages[i].pdf = chat.messages[i].file.name;
                        break;
                }
                chat.messages[i].file = true;
            }else{
                chat.messages[i].file = false;
            }
            console.log(chat.messages[i]);
        }
    }

    chat.userId     = req.session.userIndentity._id;
    chat.userName   = req.session.userIndentity.name.firstName + " " + req.session.userIndentity.name.secondName;
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

    chat = connections[connections.length - 1];
    connections[connections.length - 1]            = socketIo;
    connections[connections.length - 1].userId     = chat.userId;
    connections[connections.length - 1].userName   = chat.userName;
    connections[connections.length - 1].chatId     = chat._id;
    connections[connections.length - 1].opponentId = chat.opponentId;
    connections[connections.length - 1].img        = chat.img;

    socketIo.join(chat._id);
    socketIo.on('chat message', function(message, file){
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

        if(typeof file == 'object'){
            data['file'] = {
                type: '',
                name: '',
            };
            data.file.type = file.type;
            data.file.name = file.name;
        }

        let socketData = Object.assign({}, data);
        socketData.date = DateModel.formatView(today);

        if(data.message != "" || data.file != undefined){
            saveMessage(data, socketIo);
            socketIo.in(connections[connections.indexOf(socketIo)].chatId).emit('chat message', socketData);
            socketIo.emit('chat message', socketData);
        }
    });

    socketIo.on('disconnect', function(){
        console.log(connections[connections.indexOf(socketIo)].userName + ' disconnected');
        connections.splice(connections.indexOf(socketIo), 1);
    })
}


exports.uploadFile = async (req, res) => {
    if(!req.xhr){
        res.render('server/error', {
            layout : null,
            err    : 500,
            message: "Iternal Server Error",
        });
        return;
    }

    let file = req.file,
        post = req.body;

    if(file.size > 8 * 1024 * 1024 * 200){
        res.status(500);
        res.send({err: 'size'});
        return;
    }

    res.send({
        fileName: file.filename,
    });
    return;

}


exports.moreMessages = async (req, res) => {
    if(!req.xhr){
        res.render('server/error', {
            layout : null,
            err    : 500,
            message: "Iternal Server Error",
        });
        return;
    }

    let post = req.body;

    console.log(req.body);
    res.status(200);
    res.send({});
    return;

}
