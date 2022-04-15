const { Db } = require('mongodb');
const mongoose = require('mongoose');
const Thread = require('./Thread');
var ObjectId = require('mongoose').Types.ObjectId;


const current = new Date();
const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

let schemaThreadComment = mongoose.Schema({
    
    body: {
        type: String,
        required: true
    }
})

let ThreadComment = mongoose.model('threadComment', schemaThreadComment)


module.exports = ThreadComment