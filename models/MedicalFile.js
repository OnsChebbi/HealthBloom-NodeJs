const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicalFile = new Schema({
    patient_id :{
        type: Schema.Types.ObjectId,
        ref: 'patient'
    },
    Surgical : [{
        title : String,
        motif : String,
        outcomes : String,
        date : Date
    }],
    //prior pregnancy and their outcomes
    Obstetric  : [{
        outcomes : String,
        pregnancyDate : Date,
        childBirthDate : Date,
        babyGender : {
            type : String,
            enum : ["male","female","unknown"],
            default : "unknown"
        }
    }],
    //list of prior and current medicament's
    Medications : [{
        name: String,
        dose: String,
        from : Date,
        until : Date
    }],
    FamilyHistory : [{
        familyMember: String,
        disease : String,
        treatments : String,
        outcomes : String
    }],
    //relationships, careers, religious,
    SocialHistory : [{
        title : String,
        info : String
    }],
    //smoking drugs alcohol
    Habits : [{
        habit : String,
        state:{
            type : String,
            enum : ["heavy","moderate","light"]
        }
    }],
});

module.exports = mongoose.model('MedicalFile',MedicalFile);