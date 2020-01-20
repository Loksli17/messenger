const User = require('./../models/UserModel');

exports.actionEditUser = async (req, res) => {

    let post = req.body;
    const {email, firstName, secondName, dateBorn} = post;

    if(JSON.stringify(post) == "{}"){
        res.render('settings/editUser', {});
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
    }

}
