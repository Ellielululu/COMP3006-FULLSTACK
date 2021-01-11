/**
 * message model
 */
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    date: Date,
    content: String,
    author: String
}, {
    collation: 'messages'
});

module.exports = mongoose.model('message', messageSchema);