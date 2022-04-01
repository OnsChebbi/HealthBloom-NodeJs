var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patient = new Schema({
    height : Number,
    appointments : [
        {
            Date : Date,
            Doctor : {
                type: Schema.Types.ObjectId,
                ref : 'doctor'
            }
        }
    ],
    Cart : {
        type: Schema.Types.ObjectId,
        ref: 'cart'
    }
})

module.exports = mongoose.model('patient',patient);