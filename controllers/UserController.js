require("dotenv").config();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const PasswordReset = require("../models/PasswordReset");
//unique string identifier
const {v4 : uuidV4} = require("uuid");

//google auth
const {OAuth2Client} = require('google-auth-library');
const googleClient = new OAuth2Client("410085321469-ndnv3jtljc9fksblkbtdv9lvu6gnv614.apps.googleusercontent.com");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'Healthbloomapp@gmail.com', // generated ethereal user
        pass: 'binarybrains', // generated ethereal password
    }
})

async function verifyMail(email) {
    let x = false;
    await User.find(function (err,data){
        for (let i = 0; i < data.length; i++){
            if (data[i].Email === email) {
                console.log("i found the email used in another account");
                x = true;
            }
        }
    })
    return x;
}

exports.getAll = async (req,res) =>{
    User.find(function (err,data){
        if(err){
            res.status(400).json("err in find method : " + err);
        }
        res.status(200).send({users:  data, message: "success"});
    });
}

exports.getById = async (req,res) =>{
    let id = req.params.id;
    User.findById({_id:id})
        .then(async user => {
            if (user.Role === "Patient") {
                let patient = await Patient.findById({_id: user._patient});
                let obj = Object.assign({user}, {patient});
                res.status(200).send(obj);
            } else if (user.Role === "Doctor") {
                let doctor = await Doctor.findById({_id: user._doctor});
                let obj = Object.assign({user}, {doctor});
                res.status(200).send(obj);

            } else if (user.Role === "Assistant") {
                let assistant = await Assistant.findById({_id: user._assistant});
                let obj = Object.assign({user}, {assistant});
                res.status(200).send(obj);

            } else {
                res.status(200).send(user);
            }
        })
        .catch(err=>{
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred while getting user from db"
            })
        })
}

exports.getPatients = async (callback) =>{
    let patients = [];
    await User.find(function (err, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Role === "Patient") {
                patients.push(data[i]);
            }
        }
    });
    return callback(null,patients);
}
exports.getAllPatients = async (req,res) => {
    this.getPatients(function (err, data) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(data);
    });
}

exports.addUser = async (req,res) =>{
    let user = new User({
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
            let patient = new Patient({
                _userId : user._id,
                height : req.body.height
            });
            await patient.save();
            user._patient= patient._id;
        }
        else if (req.body.Role === "Doctor"){
            console.log("new Doctor");
            let doctor = new Doctor({
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
            let assistant = new Assistant({
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

// create token for login
function createLoginToken(user){
    let restUserInfo = null;
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
            Email: user.Email,
            Role: user.Role,
            restUserInfo : restUserInfo
        },
        process.env.JWT_KEY,
        {
            expiresIn: "2h",
        }
    );
    return token;
}

exports.login = async (req,res)=>{
    try{
        const {Email,Password} = req.body;
        let restUserInfo = null;
        if(!(Email && Password)){
            res.status(401).send("All input is required");
        }
        const user = await User.findOne({Email});
        if (user){
            if(await bcrypt.compare(Password,user.Password)){
                const token = createLoginToken(user);
                user.Token = token;
                res.status(200).json(token);
            }
            else
                res.status(400).send("wrong password");
        }
        else
            res.status(402).send("email is wrong");

    }catch (err){
        res.status(400).send(err);
    }
}

//complete profile
exports.completeProfile = async (req,res) =>{
    // updating the actual user
    let id = req.params.id;
    console.log(req.body);
    let user = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Sex: req.body.Sex,
        Password: await bcrypt.hash(req.body.Password,10),
        Address: req.body.Address,
        Picture: req.body.Picture,
        Phone: req.body.Phone,
        Role : req.body.Role,
        BirthDate : req.body.BirthDate
    }
    User.findByIdAndUpdate({_id:id}, user)
        .then(result=>{
            if (user.Role === "Patient") {
                console.log("new patient");
                let patient = new Patient({
                    _userId : id,
                    height : req.body.height,
                    weight : req.body.weight,
                    IMC : (req.body.weight)/((req.body.height)*(req.body.height)),
                    BloodType: req.body.BloodType
                })
                patient.save()
                    .then(()=>{
                        user._patient=patient._id;
                        User.findByIdAndUpdate({_id:id}, user)
                            .then(resultt=>{
                                res.status(200).send("profile completed")
                            })
                    })
            } else if (user.Role === "Doctor") {
                console.log("new doc");
                let doctor = new Doctor({
                    Speciality: req.body.Speciality,
                    OfficeAddress: req.body.OfficeAddress,
                    ProfessionalCardNumber: req.body.ProfessionalCardNumber,
                })
                doctor.save()
                    .then(()=>{
                            user._doctor=doctor._id;
                            User.findByIdAndUpdate({_id:id}, user)
                                .then(resultt=>{
                                    res.status(200).send("profile completed")
                                })
                    }
                    )
            } else if (user.Role === "Assistant") {
                console.log("new assistant");
                let assistant = new Assistant({
                    Speciality: req.body.Speciality,
                    Description: req.body.Description,
                    ActsAndCare: req.body.ActsAndCare
                })
                assistant.save()
                    .then(()=>{
                        user._assistant=assistant._id;
                        User.findByIdAndUpdate({_id:id}, user)
                            .then(resultt=>{
                                res.status(200).send("profile completed")
                            })
                    })
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send("error");
        })
}

//update user
exports.updateUser = async (req, res) => {
    // updating the actual user
    let id = req.params.id;
    let user ={
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: await bcrypt.hash(req.body.Password,10),
        Address: req.body.Address,
        Picture: req.body.Picture,
        Phone: req.body.Phone,
        Role : req.body.Role,
        BirthDate : req.body.BirthDate
    }
    User.findByIdAndUpdate({_id:id}, user)
        .then(async result=>{
            //updating the rest of his info (doctor/patient/assistant)
            let id2; // for the role id (doctor/patient/assistant)
            let user1; // instance of user to get the profession id
            await User.findById({_id: id})
                .then(async data => {
                    user1 = data;
                    if (user1.Role === "Patient") {
                        id2 = user1._patient;
                        const patient = {
                            height: req.body.height
                        };
                        await Patient.findByIdAndUpdate({_id: id2}, patient, (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                        })
                    } else if (user1.Role === "Doctor") {
                        console.log("updating doctor");
                        id2 = user1._doctor;
                        const doctor = {
                            Speciality: req.body.Speciality,
                            OfficeAddress: req.body.OfficeAddress,
                            ProfessionalCardNumber: req.body.ProfessionalCardNumber,
                            Insurance: req.body.Insurance,
                            LaborTime: req.body.LaborTime,
                            Description: req.body.Description,
                            ActsAndCare: req.body.ActsAndCare
                        };
                        await Doctor.findByIdAndUpdate({_id: id2}, doctor, (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                        })
                    } else if (user1.Role === "Assistant") {
                        id2 = user1._assistant;
                        const assistant = {
                            Speciality: req.body.Speciality,
                            Description: req.body.Description,
                            ActsAndCare: req.body.ActsAndCare
                        };
                        await Assistant.findByIdAndUpdate({_id: id2}, assistant, (err) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                        })
                    }
                })
                .catch(err=>{
                    res.status(400).send(err);
                })
        })
        .catch(err=>{
            res.status(400).send(err);
        })




    res.status(200).send("update successful");

}
//delete user
exports.deleteUser = async (req,res) =>{
    let id = req.params.id;
    let id2;
    let user;
    await User.findById({_id:id},function (err,data){
        if(err) {
            res.status(400).send(err);
        }
        user = data;
    })
    await User.findByIdAndRemove({_id:id2},(err) =>{
        if (err) {
            res.status(400).send(err);
        }
    });
    console.log(user);
    if(user.Role === "Patient"){
        id2=  user._patient;
        await Patient.findByIdAndRemove({_id:id2},(err) =>{
            if (err) {
                res.status(400).send(err);
            }
        });

    }
    else if(user.Role === "Doctor"){
        id2= user._doctor;
        await Doctor.findByIdAndRemove({_id:id2},(err) =>{
            if (err) {
                res.status(400).send(err);
            }
        });
    }
    else if(user.Role === "Assistant"){
        id2 = user._assistant;
        await Assistant.findByIdAndRemove({_id:id2},(err) =>{
            if (err) {
                res.status(400).send(err);
            }
        });
    }
    res.status(200).send("delete successful");
}

//change password
exports.changePassword = async (req,res) =>{
    const id = req.params.id;
    const newPassword = await bcrypt.hash(req.body.newPassword,10);
    let user;
    await User.findById({_id:id},function (err,data){
        if(err) {
            res.status(400).send(err);
        }
        user = data;
    })
    user.Password=newPassword;
    await User.findByIdAndUpdate({_id: user._id},user,(err)=>{
        if(err) {
            res.status(400).send(err);
        }
    });
    res.status(200).send('password updated');

}
//   ******************** {Password reset section} **********************
//password reset
exports.resetPasswordRequest = (req,res) =>{
    const {email,redirectUrl} = req.body;
    //check if user exists
    User.find({'Email': email})
        .then((data)=>{
            if (data.length){
                //check if user is verified ( we need to make some minor changes later )
                sendResetEmail(data[0],redirectUrl,res);
            } else {
                res.json({
                    status : "Failed",
                    message : "No account with the supplied email exists!"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred while checking for existing user"
            })
        })
}
//send reset pwd mail function
function sendResetEmail({_id,Email},redirectUrl,res){
    const resetString = uuidV4()+_id;
    //first we try to clear off of the existing reset password requests in order to make the operation run smooth
    PasswordReset.deleteMany({userId: _id})
        .then(result => {
            //now we send the email
            const mailParams = {
                from: 'Healthbloomapp@gmail.com', // sender address
                to: Email, // list of receivers
                subject: "you forgot your account's password ?", // Subject line
                html: `<p>Hello, we heard that you lost your password.</p>
                    <p>no need to be worried just use the link below in order to reset it </p>
                    <p>this link <b>expiers in 60 minutes</b></p <p>Press <a href=${
                    redirectUrl +"/"+_id+"/"+resetString}>here</a></p>
                    <p>if this request wast not made by you please contat us </p>`
            };
            //hash te reset string
            bcrypt.hash(resetString,10)
                .then(hashedResetString =>{
                    const newPwdRest = new PasswordReset({
                        userId : _id,
                        resetString: hashedResetString  ,
                        createdAt: Date.now(),
                        expiredAt: Date.now()+3600000
                    });
                    newPwdRest.save()
                        .then(() => {
                            transporter.sendMail(mailParams)
                                .then(
                                    res.json({
                                        status : "Pending",
                                        message : "pwd reset mail sent"
                                    })
                                )
                        })
                })
            })
        .catch(err=>{
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred while clearing existing rest pwd records"
            })
        })
}
//resetting the pwd after getting the mail
exports.resetForgottenPassword = async (req, res) => {
    let {userId, resetString, newPassword} = req.body;
    await PasswordReset.find({userId: userId}, (err, result) => {
        if (err) {
            res.status(400).send(err);
        }
        if (result.length > 0){
            if (result[0].expiredAt < Date.now()) {
                //we delete the request if the expiration date has passed
                PasswordReset.deleteOne({'userId':userId},(err)=>{
                    if(err) {
                        res.status(400).send(err);
                    }
                })
                res.status(400).send("the request has expired");
            } else {
                //the request is still valid
                bcrypt.compare(resetString,result[0].resetString)
                    .then((result)=>{
                        if(result){
                            //existing record and valid resetString
                            bcrypt.hash(newPassword,10).then(hashedNewPassword =>{
                                    //we need to update the user
                                    User.updateOne({_id:userId},{Password: hashedNewPassword },(err)=>{
                                        if (err) {
                                            res.status(400).send(err);
                                        }

                                        //password is updated now we just need to delete the request
                                        PasswordReset.deleteOne({userId: userId},(err)=>{
                                            if(err) {
                                                res.status(400).send(err);
                                            }
                                            res.status(200).send("password reset is done successfully");
                                        })
                                    })
                            }
                            )
                        } else {
                            //existing record but invalid resetString
                            res.json({
                                status:"Failed",
                                message:"Invalid resetString provided"
                            })
                        }
                    })
            }
        } else {
            res.status(400).send("password reset request not found");
        }
    })
}

// look for doctors
exports.getDoctors = async (callback) =>{
    let doctors = [];
    await User.find(function (err, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].Role === "Doctor") {
                doctors.push(data[i]);
            }
        }
    });
    return callback(null,doctors);
}
exports.FindDoctor = async (req,res) => {
    this.getDoctors(function (err, data) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send(data);
    });
}

exports.googleAuth = async (req,res)=>{
    const {tokenId} = req.body;
    let restUserInfo = null;
    await googleClient.verifyIdToken({
        idToken : tokenId,
        audience: "410085321469-ndnv3jtljc9fksblkbtdv9lvu6gnv614.apps.googleusercontent.com"
    })
        .then(response =>{
            const {email_verified,name,email} = response.payload;
            console.log(response.payload);
            if(email_verified){
                 User.findOne({Email : email})
                     .exec(async (err, user) => {
                         if (err) console.log(err);
                         if (user) {
                             //user found and already registered in app  so we only need to log him in and send token to front
                             console.log(user);
                             const token = createLoginToken(user);
                             res.status(200).json(token);
                         } else {
                             //user not registered so we need to sign him up
                             console.log("not registered");
                             let user = new User({
                                 FirstName: response.payload.given_name,
                                 LastName: response.payload.family_name,
                                 Email: response.payload.email,
                             });
                             console.log(user);
                             await user.save();
                             //here we send a mail that he need to complete his credentials & set a new password
                             const mailParams = {
                                 from: 'Healthbloomapp@gmail.com', // sender address
                                 to: user.Email, // list of receivers
                                 subject: "welcome to our app", // Subject line
                                 html: `<p><h1>Hi, we're Health Bloom</h1></p>
                                 <p><h3>Thanks for choosing us to help you manage your medical care follow-up</h3></p>
                                 <p>Please redirect to the platform to complete your informations and set a new password</p>`
                             };
                             transporter.sendMail(mailParams);
                             //now we send token so user can login automatically
                             const token = createLoginToken(user);
                             res.status(200).json(token);
                         }
                     })
            }
        })
        .catch(err=>{
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred while checking google tokenId"
            })
        })
}