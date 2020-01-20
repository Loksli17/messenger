const User     = require('../models/UserModel');
const config   = require('../config');
const mongoose = require("../lib/database/mongoose");
const async    = require('async');
const crypto   = require('crypto');


let query = async () => {
    let remove = await User.remove({});

    let create = await async.parallel([
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Олежа',
                                    secondName: 'Чеботарев',
                                },
                                dateBorn: '2002-01-01',
                                email: 'ami0504@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });
                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Вася',
                                    secondName: 'Чеботарев',
                                },
                                dateBorn: '2005-11-23',
                                email: 'ami0505@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('1234').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Юха',
                                    secondName: 'Спицин',
                                },
                                dateBorn: '2005-11-23',
                                email: 'ami0506@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Мазда',
                                    secondName: 'Хонда',
                                },
                                dateBorn: '2005-11-23',
                                email: 'ami0507@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Дмитрий',
                                    secondName: 'Белан',
                                },
                                dateBorn: '2001-09-11',
                                email: 'ami0508@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Олежа',
                                    secondName: 'Рукавишников',
                                },
                                dateBorn: '2001-09-11',
                                email: 'ami0509@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                                img: 'test.png',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                    ],
                    function(err, result){
                        console.log(result);
                    });
}

query();
