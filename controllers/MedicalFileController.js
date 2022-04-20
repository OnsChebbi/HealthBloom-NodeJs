const MedicalFile = require ('../models/MedicalFile');
const Patient = require('../models/Patient');


exports.getAll = async (req, res) => {
    await MedicalFile.find((err, data) => {
        if (err) throw err;
        res.status(200).send(data);
    })
}

// this method will return the medical file based upon the patient _id provided
exports.getById = async (req,res) =>{
    let id = req.params.id;
    await Patient.findById({_id:id})
        .then(patient=>{
            MedicalFile.findById({_id:patient.medicalFile})
                .then(medicalFile=>{
                    res.status(200).send(medicalFile);
                })
                .catch(err=>{
                    console.log(err);
                    res.json({
                        status : "Failed",
                        message : "error occurred this patient has no medical file yet "
                    })
                })
        })
        .catch(err=>{
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred no patient found with the provided id "
            })
        })
}

//add or update a patients medical file ( dont forget to provide the patient _id in the request body)
exports.add = async (req,res) =>{
    let medicalFile = new MedicalFile({
        patient_id: req.body.patient_id,
    })
    let Surgical= ({
        title : req.body.Surgical.title,
        motif : req.body.Surgical.motif,
        outcomes : req.body.Surgical.outcomes,
        date : req.body.Surgical.date
    });
    let Obstetric=({
        outcomes : req.body.Obstetric.outcomes,
        pregnancyDate : req.body.Obstetric.pregnancyDate,
        childBirthDate : req.body.Obstetric.childBirthDate,
        babyGender: req.body.Obstetric.babyGender
    })
    let Medications=({
        name: req.body.Medications.name,
        dose: req.body.Medications.dose,
        from : req.body.Medications.from,
        until : req.body.Medications.until
    });
    let FamilyHistory =({
        familyMember: req.body.FamilyHistory.familyMember,
        disease : req.body.FamilyHistory.disease,
        treatments : req.body.FamilyHistory.treatments,
        outcomes : req.body.FamilyHistory.outcomes
    });
    let SocialHistory =({
        title : req.body.SocialHistory.title,
        info : req.body.SocialHistory.info
    });
    let Habits =({
        habit : req.body.Habits.habit,
        state: req.body.Habits.state
    });
    //look for the patient that we will update or add his medical file
    await Patient.findById({_id:req.body.patient_id})
        .then(patient=>{
            //if the patient already has a medical file we need to update
            if(patient.medicalFile){
                //so here we need to get the medical file so we can update it
                MedicalFile.findById({_id:patient.medicalFile})
                    .then(medF=>{
                        if(Surgical.title){
                            medF.Surgical.push(Surgical)
                        }
                        if(Obstetric.outcomes){
                            medF.Obstetric.push(Obstetric)
                        }
                        if (Medications.name){
                            medF.Medications.push(Medications)
                        }
                        if (FamilyHistory.familyMember){
                            medF.FamilyHistory.push(FamilyHistory)
                        }
                        if (SocialHistory.title){
                            medF.SocialHistory.push(SocialHistory)
                        }
                        if (Habits.habit){
                            medF.Habits.push(Habits)
                        }
                        //then we update
                        MedicalFile.findByIdAndUpdate({_id:patient.medicalFile},medF,{ useFindAndModify: false },(err,data) =>{
                            if (err) throw err;
                            res.status(200).send(data);
                        })

                    })
                    .catch(err=>{
                        console.log(err);
                        res.json({
                            status : "Failed",
                            message : "error occurred while getting medical file for update "
                        })
                    })
            } //if the patient doesn't have a medical file we need to create a new one
            else {
                if(Surgical.title){
                    medicalFile.Surgical.push(Surgical)
                }
                if(Obstetric.outcomes){
                    medicalFile.Obstetric.push(Obstetric)
                }
                if (Medications.name){
                    medicalFile.Medications.push(Medications)
                }
                if (FamilyHistory.familyMember){
                    medicalFile.FamilyHistory.push(FamilyHistory)
                }
                if (SocialHistory.title){
                    medicalFile.SocialHistory.push(SocialHistory)
                }
                if (Habits.habit){
                    medicalFile.Habits.push(Habits)
                }
                medicalFile.save();
                Patient.updateOne({_id:req.body.patient_id},{medicalFile: medicalFile._id },(err,data)=>{
                    if (err) throw err;
                    res.status(200).send(data);
                })
            }
            console.log(patient);
        })
        .catch(err=>{
            console.log(err);
            res.json({
                status : "Failed",
                message : "error occurred no patient found with the provided id "
            })
        })
}