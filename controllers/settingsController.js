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

    res.redirect('/');
}


exports.actionUploadFile = async (req, res) => {
    if(!req.xhr){
        res.render('server/error', {
            layout : null,
            err    : 500,
            messege: "Iternal Server Error",
        });
    }

    let file = req.file;

    if(file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg'){
        res.status(500);
        res.send();
        return;
    }

    if(file.size > 8 * 1024 * 1024 * 5){
        res.status(500);
        res.send();
        return;
    }

    let newUser = res.locals.user;
    newUser.img = file.filename;
    await UserModel.updateOne({_id: newUser._id}, user);

}
