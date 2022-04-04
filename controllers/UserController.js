require("dotenv").config();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.getAll = async (req,res) =>{
    User.find(function (err,data){
        if(err) throw err;
        res.status(200).send({users:  data, message: "success"});
    });
}

// exports.getAllPatients = async (req,res) =>{
//     var patients = [Patient];
//     await User.find(function (err,data){
//         for( var i =0 ; i<data.length;i++){
//             if(data[i].Role === "Patient"){
//                 patients.push(data[i]);
//             }
//         }
//     });
//     res.status(200).send(patients);
// }

exports.getPatients = async (callback) =>{
    var patients = [];
    await User.find(function (err, data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Role === "Patient") {
                patients.push(data[i]);
            }
        }
    });
    return callback(null,patients);
}
exports.getAllPatients = async (req,res) => {
     this.getPatients(function (err, data) {
        if (err) throw err;
        res.status(200).send({users: data, message: "success"});
    });
}

exports.addUser = async (req,res) =>{
    var user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: await bcrypt.hash(req.body.Password,10),
        Address: req.body.Address,
        Picture: req.body.Picture,
        Phone: req.body.Phone,
        Role : req.body.Role,
        BirthDate : req.body.BirthDate
    })
    if(req.body.Role === "Patient"){
        console.log("new patient");
        var patient = new Patient({
            _userId : user._id,
            height : req.body.height
        });
        await patient.save();
        user._patient= patient._id;
    }
    else if (req.body.Role === "Doctor"){
        console.log("new Doctor");
        var doctor = new Doctor({
            Speciality: req.body.Speciality,
            OfficeAddress: req.body.OfficeAddress,
            ProfessionalCardNumber: req.body.ProfessionalCardNumber,
            Insurance: req.body.Insurance,
            LaborTime: req.body.LaborTime,
            Description: req.body.Description,
            ActsAndCare: req.body.ActsAndCare

        });
        await doctor.save();
        user._doctor= doctor._id;
    }
    else if (req.body.Role === "Assistant"){
        console.log("new Assistant");
        var assistant = new Assistant({
            Speciality: req.body.Speciality,
            Description: req.body.Description,
            ActsAndCare: req.body.ActsAndCare
        });
        await assistant.save();
        user._assistant= assistant._id;
    }
    user.Role = req.body.Role;
    await user.save();
    res.status(200).send(user);
}

exports.login = async (req,res)=>{
    try{
        const {Email,Password} = req.body;
        var restUserInfo = null;
        if(!(Email && Password)){
            res.status(400).send("All input is required");
        }
        const user = await User.findOne({Email});
        if(user&&(await bcrypt.compare(Password,user.Password))){
            if(user.Role === "Patient"){
                restUserInfo = user._patient;
            }
            else if(user.Role === "Doctor"){
                restUserInfo = user._doctor;

            }
            else if(user.Role === "Assistant"){
                restUserInfo = user._assistant;

            }
            const token = jwt.sign(
                {
                    user_id: user._id,
                    Email,
                    Role: user.Role,
                    restUserInfo : restUserInfo
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "2h",
                }
            );
            user.Token = token;
            res.status(200).json(token);
        }
    }catch (err){
        console.log(err);
    }
}

//update user

//delete user
exports.deleteUser = (req,res) =>{
    var id = req.params.id;

}