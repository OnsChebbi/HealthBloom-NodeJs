const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicalFile = new Schema({
    Surgical : [String],
    Obstetric  : [String],//prior pragancy and their outcomes
    Medications : [String], //list of prior and current medicaments
    FamilyHistory : [String],
    SocialHistory : [String],
    Habits : [String],
});

module.exports = mongoose.model('MedicalFile',MedicalFile);