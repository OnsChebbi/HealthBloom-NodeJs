const { Db } = require('mongodb');
const mongoose = require('mongoose');
const ThreadComment = require('./ThreadComment')
const {Schema} = mongoose;



let schemaThread = Schema({
    title: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,

    },
    initContent : {type: Schema.Types.ObjectId,ref:'threadComment'},

    comments : [{type: Schema.Types.ObjectId,ref:'threadComment'}],
    section : {type: Schema.Types.ObjectId,ref:'forumSection'}
})

let Thread = mongoose.model('thread', schemaThread)


module.exports = Thread