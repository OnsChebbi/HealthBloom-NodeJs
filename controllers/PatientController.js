const Patient = require('../models/Patient');
const {getPatient} = require("./PatientController");

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
    var id = req.params.id;

    var patient = {
        height : req.body.height
    }
    Patient.findByIdAndUpdate({_id:id}, patient,(err) =>{
        if (err) throw err;
    });
    res.status(200).send(patient);

}

exports.deletePatient = async (req,res) => {
    var id = req.params.id;
    console.log(id);
    Patient.findByIdAndRemove({_id:id},(err)=>{
        if (err) throw err;
    })
    res.status(200).send("delete successful");
}