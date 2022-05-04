var mongoose = require('mongoose');
const User = require("../models/User");
var Schema = mongoose.Schema;

var ObjectId = require('mongoose').Types.ObjectId;


var assistant = new Schema({
    Speciality : String,
    Description: String,
    ActsAndCare : String
})




module.exports = mongoose.model('assistant',assistant);