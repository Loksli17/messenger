const UserModel = require('./../models/UserModel');

const DateModule = require('./../lib/date');


exports.actionEditUser = async (req, res) => {

    let post = req.body;
    const {email, firstName, secondName, dateBorn} = post;

    if(JSON.stringify(post) == "{}"){
        res.render('settings/editUser', {});
        return;
    }

    if(
        email      == '' ||
        firstName  == '' ||
        secondName == '' ||
        dateBorn   == ''
    ){
        res.render('settings/editUser', {
            error: 'Есть пустые поля',
        });
        return;
    }

    let user = await UserModel.findById(req.cookies.authToken.id);
    //updating
    user.dateBorn        = dateBorn;
    user.name.firstName  = firstName;
    user.name.secondName = secondName;
    user.email           = email;

    await UserModel.updateOne({_id: user._id}, user);

    req.session.userIndentity = user;
    res.locals.user = req.session.userIndentity;
    console.log(req.session.userIndentity, res.locals.user);

    res.redirect('/');
}
