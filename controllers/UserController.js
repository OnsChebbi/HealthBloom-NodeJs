require("dotenv").config();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.getAll = async (req,res) =>{
    var id = req.params.id;
    User.find(function (err,data){
        if(err) throw err;
        res.status(200).send({users:  data, message: "success"});
    });
}

exports.getById = async (req,res) =>{
    var id = req.params.id;
    User.findById({_id:id},function (err,data) {
        if(err) throw err;
        res.status(200).send(data);
    })
}

exports.getAllPatients = async (req,res) =>{
    var patients = [Patient];
    await User.find(function (err,data){
        for( var i =0 ; i<data.length;i++){
            if(data[i].Role === "Patient"){
                patients.push(data[i]);
            }
        }
    });
    res.status(200).send(patients);
}

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
exports.getAllP = async (req,res) => {
    console.log("hello");
    //  this.getPatients(function (err, data) {
    //     if (err) throw err;
    //     res.status(200).send({users: data, message: "success"});
    // });
    res.status(200).send("test");
}

exports.test = async (req,res) =>{
    console.log("this test works");
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
exports.updateUser = async (req, res) => {
    // updating the actual user
    var id = req.params.id;
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
    User.findByIdAndUpdate({_id:id}, user,(err) =>{
        if (err) throw err;
    })

    //updating the rest of his info (doctor/patient/assistant)
    var id2; // for the role id (doctor/patient/assistant)
    var user1; // instance of user to get the profession id
    await User.findById({_id: id}, function (err, data) {
        if (err) throw err;
        user1 = data;
    })
    if(user.Role === "Patient"){
        id2 =  user._patient;
        const patient = new Patient({
            _userId : user._id,
            height : req.body.height
        });
        await Patient.findByIdAndUpdate({_id:id2},patient,(err) =>{
            if (err) throw err;
        })
    }
    else if(user.Role === "Doctor"){
        id2 = user._doctor;
        const doctor = new Doctor({
            Speciality: req.body.Speciality,
            OfficeAddress: req.body.OfficeAddress,
            ProfessionalCardNumber: req.body.ProfessionalCardNumber,
            Insurance: req.body.Insurance,
            LaborTime: req.body.LaborTime,
            Description: req.body.Description,
            ActsAndCare: req.body.ActsAndCare
        });
        await Doctor.findByIdAndUpdate({_id:id2},doctor,(err) =>{
            if (err) throw err;
        })
    }
    else if(user.Role === "Assistant"){
        id2 = user._assistant;
        const assistant = new Assistant({
            Speciality: req.body.Speciality,
            Description: req.body.Description,
            ActsAndCare: req.body.ActsAndCare
        });
        await Assistant.findByIdAndUpdate({_id:id2},assistant,(err) =>{
            if (err) throw err;
        })
    }
    res.status(200).send("delete successful");

}
//delete user
exports.deleteUser = async (req,res) =>{
    var id = req.params.id;
    var id2;
    var user;
    await User.findById({_id:id},function (err,data){
        if(err) throw err;
        user = data;
    })
    await User.findByIdAndRemove({_id:id2},(err) =>{
        if (err) throw err;
    });
    console.log(user);
    if(user.Role === "Patient"){
        id2=  user._patient;
        await Patient.findByIdAndRemove({_id:id2},(err) =>{
            if (err) throw err;
        });

    }
    else if(user.Role === "Doctor"){
        id2= user._doctor;
        await Doctor.findByIdAndRemove({_id:id2},(err) =>{
            if (err) throw err;
        });
    }
    else if(user.Role === "Assistant"){
        id2 = user._assistant;
        await Assistant.findByIdAndRemove({_id:id2},(err) =>{
            if (err) throw err;
        });
    }
    res.status(200).send("delete successful");
}