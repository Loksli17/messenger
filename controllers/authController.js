exports.actionLogin = function(req, res){
    res.render('auth/login', {
        
    });
};

exports.actionSignup = function(req, res){
    res.send('singup');
}
