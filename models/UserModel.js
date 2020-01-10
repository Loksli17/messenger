const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: {
        firstName: {
            type    : String,
            required: true,
        },
        secondName:{
            type    : String,
            required: true,
        }
    },
    email: {
        type    : String,
        required: true,
        unique  : true,
    },
    pass: {
        type    : String,
        required: true,
    },
});

userSchema.methods.getFullName = function(){
    return this.name.firstName + ' ' + this.name.secondName;
};

let user = mongoose.model('users', userSchema);
module.exports = user;
