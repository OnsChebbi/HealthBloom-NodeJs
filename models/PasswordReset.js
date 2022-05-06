const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasswordReset = new Schema({
    userId : String,
    resetString: String,
    createdAt: Date,
    expiredAt: Date
});

module.exports = mongoose.model('PasswordReset',PasswordReset);