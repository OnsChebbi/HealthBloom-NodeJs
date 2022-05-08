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
    dateCreated: {
        type: String,

    },
    likes : [{type: Schema.Types.ObjectId,ref:'threadCommentLike'}],
    user : {type: Schema.Types.ObjectId,ref:'user'},

})

let ThreadComment = mongoose.model('threadComment', schemaThreadComment)

module.exports = ThreadComment