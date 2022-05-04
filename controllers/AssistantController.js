var Assistant = require('../models/Assistant');
var User = require('../models/User');



const mongoose = require("mongoose");
const {ObjectID} = require("mongodb");
//const User = require("./User");



exports.getAllAssistants=(req,res)=>{
    Assistant.find(function(err,data) {
        if(err) throw err;
        res.status(200).send(data);

    });

}



exports.getAssistantByID=async(req,res)=>{

    let id= req.params.id;
    const objectId = new ObjectID(id.trim());

    Assistant.findById( objectId,(err,data)=> {
        if(err) throw err;
        res.status(200).send(data);

    });


}

exports.EditAssistantByID=async(req,res)=>{

    console.log("edit Assistant");
    const emp = {
        Speciality: req.body.Speciality,
        Description: req.body.Description,
        ActsAndCare: req.body.ActsAndCare
    };
    Assistant.findByIdAndUpdate(req.params.id, { $set: emp }, { new: true }, (err, data) => {
        if(err) throw err;
        res.status(200).send(data);
    });
    //User._assistant = Assistant._id;

}

exports.DeleteAssistantsById=(req,res)=>{
    Assistant.findByIdAndRemove(req.params.id,(err,data)=> {
        if(err) throw err;
        res.status(200).send(data);


    });
    //res.send(assistants);
}

exports.DeleteAllAssistants=(req,res)=>{
    Assistant.remove(function(err,data) {
        if(err) throw err;
        res.status(200).send(data);

    });

}




