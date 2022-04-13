const MedicalFile = require ('../models/MedicalFile');

exports.getAll = async (req, res) => {
    await MedicalFile.find((err, data) => {
        if (err) throw err;
        res.status(200).send(data);
    })
}

exports.add = async (req,res) =>{
    var medicalFile = new MedicalFile({

    })
    await medicalFile.save();
    res.status(200).send(medicalFile);
}