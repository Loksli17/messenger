exports.actionIndex = function(req, res){
    let date = new Date()
    res.render('index', {
        date: date,
    });
};
