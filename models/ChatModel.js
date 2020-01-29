const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    messages : {
        type : Array,
        text : String,
        date : String,
        time : String,

    },
    users    : Object,
})

let chat = mongoose.model('chat',chatSchema);

module.exports = chat;
