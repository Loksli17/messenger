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
    const {email, password, rememberMe} = post;

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

    //запомнить меня
    if(rememberMe != undefined){
        let token = Math.round((new Date().valueOf() * Math.random())) + '',
            series = Math.round((new Date().valueOf() * Math.random())) + '';

        res.cookie(
            'authToken',
            {
                id    : user._id,
                token : token,
                series: series
            },
            {
                expires: new Date(Date.now() + 2 * 604800000),
            }
         );

         user.token = token;
         user.series = series;
         console.log(user);

         await UserModel.updateOne({_id: user.id}, user);
    }else{
        user.token = '';
        user.series = '';
        await UserModel.updateOne({_id: user.id}, user);
    }

    req.session.userIndentity = user;
    res.redirect('/');
};

exports.actionLogout = (req, res) => {
    delete req.session.userIndentity;
    res.clearCookie('authToken');
    res.redirect('/auth/login');
}

exports.actionSignup = (req, res) => {
    res.send('singup');
}
