exports.actionLogin = function(req, res){
    const {email, password} = req.body;
    console.log(email, password);
    res.render('auth/login', {

    });
};

exports.actionSignup = function(req, res){
    res.send('singup');
}
