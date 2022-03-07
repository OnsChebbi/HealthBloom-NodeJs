var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./User');


var user = new User();
var Patient = Object.create(user);
Patient.listeRdv = String;
var PatientSchema = new Schema(Patient);
module.exports = mongoose.model('Patient',PatientSchema);