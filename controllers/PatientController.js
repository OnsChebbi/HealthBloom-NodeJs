const Patient = require('../models/Patient');
const User = require('../models/User');
const userController = require('../controllers/UserController');

// async function getOne(req, res, next) {
//     var id = req.params.id;
//     var patient = await Patient.findById({_id: id}, (err, data) => {
//         if (err) throw err;
//         return data;
//         //res.status(200).json(data);
//     })
// }

exports.getPatient = async (req, res) => {
    var id = req.params.id;
    var patient = await Patient.findById({_id: id}, (err, data) => {
        if (err) throw err;
        res.status(200).json(data);
    })
}

exports.updatePatientAction = async (req, res) => {
    //get the patient id from req
    var id = req.params.id;
    var patient = {
        height : req.body.height,
        weight: req.body.weight,
        BloodType: req.body.BloodType
    }
    //update the patient entity
    Patient.findByIdAndUpdate({_id:id}, patient,(err) =>{
        if (err) throw err;
    });
    //look for the related user id to update it too
    await userController.getPatients(function (err,data){
        if(err) throw err;
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
        Email: req.body.Email,
        Address: req.body.Address,
        Phone: req.body.Phone,
        BirthDate: req.body.BirthDate,
        newsLetter: req.body.newsLetter
    }
    User.findByIdAndUpdate({_id:id},user,(err) =>{
        if (err) throw err;
    })
    //sending the response back
    res.status(200).send({user:  user,patient: patient, message: "success"});

}

exports.deletePatient = async (req,res) => {
    var id = req.params.id;
    await Patient.findByIdAndRemove({_id:id},(err)=>{
        if (err) throw err;
    })
    await userController.getPatients(function (err,data){
        if(err) throw err;
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
        if (err) throw err;
    })
    res.status(200).send("delete successful");
}