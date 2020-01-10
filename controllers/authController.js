const crypto    = require('crypto');

const mongoose  = require('./../lib/database/mongoose');
const config    = require('./../config');

const UserModel = require('./../models/UserModel');


exports.actionLogin = async (req, res) => {

    if(req.session.userIndentity != undefined){
        res.redirect('/');
        return;
    }

    let post = req.body,
        user = {};
    const {email, password} = post;

    //проверка пришли ли данные
    if(JSON.stringify(post) == "{}"){
        res.render('auth/login', {});
        return;
    }

    if(email == '' || password == ''){
        res.render('auth/login', {
            error: "Есть пустые поля",
        });
        return;
    }

    user = await UserModel.findOne({email: email});

    if(user == null){
        res.render('auth/login', {
            error: "Неверное имя пользователя или пароль",
        });
        return;
    }

    let hash = crypto.createHash('sha256', config.user.passSecret).update(password).digest('hex');
    if(hash != user.pass){
        res.render('auth/login', {
            error: "Неверное имя пользователя или пароль",
        });
        return;
    }
    req.session.userIndentity = user;
    console.log(req.session.userIndentity);
    res.redirect('/');

};

exports.actionSignup = function(req, res){
    res.send('singup');
}
