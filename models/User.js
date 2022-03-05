var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    FirstName : String,
    LastName : String,
    Email : String,
    Password : String,
    Address : String,
    Picture : String,
    Phone : Number
});
module.exports = mongoose.model('user',user);