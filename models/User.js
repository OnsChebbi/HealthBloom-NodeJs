var util = require('util');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const {Db} = require ('mongodb');

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
    Sex : {
        type : String,
        enum : ["male","female","unknown"],
        default : "unknown"
    },
    Token : String,
    newsLetter : {
        type : Boolean,
        default : true
    },
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

//module.exports

module.exports = mongoose.model('user',user);
 //let User
//
// let url = 'mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom';
//
// exports.getAll = () =>{
//     return new  Promise((resolve , reject) =>{
//         console.log("new promise");
//         mongoose.connect(url).then(
//             ()=>{
//                 console.log("database connected");
//                 //Find all articles
//                 return User.find();
//             }
//         )
//             .then(user=>{
//                 resolve(user)
//                 console.log(user)
//             })
//             .catch(err => reject(err))
//     })
// }

