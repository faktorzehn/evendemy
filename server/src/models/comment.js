const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    text: {type: String, default: ''},
    creationDate: {type: Date, default: Date.now},
    author: {type: String, required: true}
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment; 