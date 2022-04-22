const { Db } = require('mongodb');
const mongoose = require('mongoose');
const ThreadComment = require('./ThreadComment')
const {Schema} = mongoose;



const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaThread = Schema({
    title: {
        type: String,
        required: true
    },

    initContent : {type: Schema.Types.ObjectId,ref:'threadComment'},

    comments : [{type: Schema.Types.ObjectId,ref:'threadComment'}],
    section : {type: Schema.Types.ObjectId,ref:'forumSection'}
})

let Thread = mongoose.model('thread', schemaThread)


module.exports = Thread