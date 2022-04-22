const { Db } = require('mongodb');
const mongoose = require('mongoose');
const Thread = require('./Thread');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;


let schemaThreadComment = Schema({
    
    body: {
        type: String,
        required: true
    },
    likes : [{type: Schema.Types.ObjectId,ref:'threadCommentLike'}]
})

let ThreadComment = mongoose.model('threadComment', schemaThreadComment)

module.exports = ThreadComment