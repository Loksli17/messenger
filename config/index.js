const settings = {
    db: {
        mongoose:{
            name: 'messenger',
            url : 'mongodb://localhost:27017/',
        },
        mysql:{
            name: '',
            url : '',
        },
    },
    app: {
        port: 3000,
        name: 'freeMessenger',
    },
    cookie: {
        secret: '34Jmf7*8kL;>G',
    },
    session: {
        secret: 'GiU9%$3#kLz>',
    },
    user: {
        passSecret: '6Jhn-Nm<',
    }
}

module.exports = settings;
