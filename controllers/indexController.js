//models
const UserModel = require('./../models/UserModel');



exports.actionIndex = async function(req, res){

    let users = [];

    users = await UserModel.find({}, null);

    res.send(users);
};
