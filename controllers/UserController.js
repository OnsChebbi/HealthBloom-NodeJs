require("dotenv").config();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
var randomstring = require("randomstring");

async function verifyMail(email) {
    var x = false;
    await User.find(function (err,data){
        for (var i = 0; i < data.length; i++){
            if (data[i].Email === email) {
                console.log("lkytt nafs l mail and user ekhor");
                x = true;
            }
        }
    })
    return x;
}

exports.getAll = async (req,res) =>{
    User.find(function (err,data){
        if(err) throw err;
        res.status(200).send({users:  data, message: "success"});
    });
}

exports.getById = async (req,res) =>{
    var id = req.params.id;
    var user = await User.findById({_id:id});
    var patient = await Patient.findById({_id:user._patient});
    var obj = Object.assign({user}, {patient});
    res.status(200).send(obj);
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
exports.getAllPatients = async (req,res) => {
    this.getPatients(function (err, data) {
        if (err) throw err;
        res.status(200).send(data);
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

    //we need to check the email here first
    if ( !await verifyMail(user.Email)){
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
    else
        res.status(400).send("this email already exists");


}

exports.login = async (req,res)=>{
    try{
        const {Email,Password} = req.body;
        var restUserInfo = null;
        if(!(Email && Password)){
            res.status(401).send("All input is required");
        }
        const user = await User.findOne({Email});
        ////
        if (user){

        }
        else
            res.status(402).send("email is wrong");
        /////
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
        else
            res.status(400).send("check your credentials");
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
    res.status(200).send("update successful");

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

//change password
exports.changePassword = async (req,res) =>{
    const id = req.params.id;
    const newPassword = await bcrypt.hash(req.body.newPassword,10);
    var user;
    await User.findById({_id:id},function (err,data){
        if(err) throw err;
        user = data;
    })
    user.Password=newPassword;
    await User.findByIdAndUpdate({_id: user._id},user,(err)=>{
        if(err) throw err;
    });
    res.status(200).send('passord updated');

}

//forget password (this one needs to be updated)
exports.forgetPassword = async (req,res) =>{
    var user = new User;
    const email= req.body.email;
    console.log(email);
    // look for the user
    await User.findOne({'Email': email},  (err,data)=>{
        if (err) throw err;
        user = data;
    });
    // generate a new password and assign it to the user
    const newPassword = randomstring.generate({
        length: 12,
        charset: "alphanumeric"
    });
    user.Password = await bcrypt.hash(newPassword,10);
    await User.findByIdAndUpdate({_id: user._id},user,(err)=>{
        if(err) throw err;
    });

    //email sender information
    let transporter = nodemailer.createTransport({
        service: 'gmail', // true for 465, false for other ports
        auth: {
            user: 'feres.benhamed99@gmail.com', // generated ethereal user
            pass: 'Dunkyfyzel1', // generated ethereal password
        },
    });
    console.log(newPassword);
    //send email if user exists
    if(await verifyMail(email)) {
        console.log("bch nabeeth mail")
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'feres.benhamed99@gmail.com', // sender address
            to: 'feres.benhamed@esprit.tn', // list of receivers
            subject: "you forgot your account's password ?", // Subject line
            html: "<b>hello we received a request that you have forgot your account's password </b>" +
                "<b> your new password is </b> "+ newPassword +
                "<b> please be aware that you must change this password as soon as you log in </b>"+
                "<b> if this was not requested by you please report to our team.</b>" // html body
        });
    }
    res.status(200).send("mail successful");

}

// look for doctors
exports.getDoctors = async (callback) =>{
    var doctors = [];
    await User.find(function (err, data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Role === "Doctor") {
                doctors.push(data[i]);
            }
        }
    });
    return callback(null,doctors);
}
exports.FindDoctor = async (req,res) => {
    this.getDoctors(function (err, data) {
        if (err) throw err;
        res.status(200).send(data);
    });
}
