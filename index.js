const express    = require('express');
const hbs        = require('hbs');
const bodyParser = require('body-parser');
const cookie     = require('cookie-parser');
const async      = require('async');
const expressHbs = require('express-handlebars');


//own libs
const config = require('./config/config');

let app = express();


//use
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie(config.cookie.secret));


//handlebars
app.engine('hbs', expressHbs({
    layoutsDir   : 'views/layouts',
    defaultLayout: 'main',
    extname      : 'hbs',
}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getLogin', function(){
    return "Логин";
});


//settings
app.set('port', process.env.PORT || config.app.port);


//routes require
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');


//routes init
app.use('/', indexRouter);
app.use('/auth', authRouter);


//soft
app.use(function(req, res){
    res.status(404);
    res.render('server/404', {layout: null});
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('server/500', {layout: null});
});


//listen
app.listen(app.get('port'), function(){
    console.log('Application are working on port: ' + config.app.port + '. Press Crtl+C for closing');
});
