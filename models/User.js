var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    //for all users
    FirstName : String,
    LastName : String,
    Email : String,
    Password : String,
    Address : String,
    Picture : String,
    Phone : Number,
    BirthDate : Date,
    Token : String,
    Role : {
        type : String,
        enum : ["Patient","Doctor","Assistant"],
        default : "Patient"
    },
    _patient:{
        type: Schema.Types.ObjectId,
        ref: 'patient'
    },
    _doctor:{
        type: Schema.Types.ObjectId,
        ref: 'doctor'
    },
    _assistant:{
        type: Schema.Types.ObjectId,
        ref: 'assistant'
    }

});

module.exports = mongoose.model('user',user);

