const mongoose  = require('./../lib/database/mongoose');
//models
const UserModel = require('./../models/UserModel');

exports.actionIndex = async function(req, res){

    let users = [];

    users = await UserModel.find({});

    res.send(users[0]);
};
