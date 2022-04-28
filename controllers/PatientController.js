const Patient = require('../models/Patient');
const User = require('../models/User');
const userController = require('../controllers/UserController');

// async function getOne(req, res, next) {
//     var id = req.params.id;
//     var patient = await Patient.findById({_id: id}, (err, data) => {
//         if (err) {
//             res.status(400).send(err);
//         }
//         return data;
//         //res.status(200).json(data);
//     })
// }

exports.getPatient = async (req, res) => {
    var id = req.params.id;
    var patient = await Patient.findById({_id: id}, (err, data) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).json(data);
    })
}

exports.updatePatientAction = async (req, res) => {
    //get the patient id from req
    var id = req.params.id;
    var patient = {
        height : req.body.height,
        weight: req.body.weight,
        BloodType: req.body.BloodType,
        IMC : (req.body.height)/((req.body.weight)*(req.body.weight))
    }
    //update the patient entity
    console.log(patient.IMC);
    Patient.findByIdAndUpdate({_id:id}, patient,(err) =>{
        if (err) {
            res.status(400).send(err);
        }
    });
    //look for the related user id to update it too
    await userController.getPatients(function (err,data){
        if(err) {
            res.status(400).send(err);
        }
        for (var i =0 ; i<data.length;i++){
            console.log(i);
            console.log(data[i]._patient);
            if(data[i]._patient.equals(id)){
                console.log("hnee");
                id= data[i]._id;
            }
        }
    });
    var user = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Sex: req.body.Sex,
        Picture: req.body.Picture,
        BirthDate: req.body.BirthDate,
        Email: req.body.Email,
        Address: req.body.Address,
        Phone: req.body.Phone,
        newsLetter: req.body.newsLetter
    }
    User.findByIdAndUpdate({_id:id},user, { useFindAndModify: false },(err) =>{
        if (err) {
            res.status(400).send(err);
        }
    })
    //sending the response back
    res.status(200).send({user:  user,patient: patient, message: "success"});

}

exports.deletePatient = async (req,res) => {
    var id = req.params.id;
    await Patient.findByIdAndRemove({_id:id},(err)=>{
        if (err) {
            res.status(400).send(err);
        }
    })
    await userController.getPatients(function (err,data){
        if(err) {
            res.status(400).send(err);
        }
        for (var i =0 ; i<data.length;i++){
            console.log(i);
            console.log(data[i]._patient);
            if(data[i]._patient.equals(id)){
                console.log("hnee");
                id= data[i]._id;
            }
        }
    });
    console.log(id);
    await User.findByIdAndRemove({_id:id},(err) =>{
        if (err) {
            res.status(400).send(err);
        }
    })
    res.status(200).send("delete successful");
}