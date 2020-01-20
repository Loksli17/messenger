const mongoose  = require('./../lib/database/mongoose');
//models
const UserModel = require('./../models/UserModel');

exports.actionIndex = async function(req, res){

    let users = [];

    users = await UserModel.find({});

    console.log(res.locals.user, req.cookies.authToken);
<<<<<<< HEAD
    res.send(users);
    
=======
    res.render('index');
>>>>>>> a5758145e81000996a4eeead0aeb39b4800298de
};
