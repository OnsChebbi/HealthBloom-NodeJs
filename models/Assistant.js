var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assistant = new Schema({
    Speciality : String,
    Description: String,
    ActsAndCare : String
})

module.exports = mongoose.model('assistant',assistant);