const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    messages : {
        type     : Array,
        text     : String,
        dateTime : String,
        checked  : Boolean,
    },
    users    : Object,
})

let chat = mongoose.model('chat',chatSchema);

module.exports = chat;
