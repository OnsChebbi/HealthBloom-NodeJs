var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patient = new Schema({
    _userId :{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
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
    },
    height : Number,
    weight : Number,
    IMC : Number,
    BloodType : {
        type: String,
        enum : ["A+","A-","B+","B-","AB+","AB-","O+","O-","unknown"],
        default : "unknown"
    }
})

module.exports = mongoose.model('patient',patient);