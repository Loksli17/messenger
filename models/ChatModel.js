const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({
    messages : Array,
    users    : Object,
})

let chat = mongoose.model('chat',chatSchema);

module.exports = chat;
