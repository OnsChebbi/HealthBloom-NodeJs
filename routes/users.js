require("dotenv").config();
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Patient = require('../models/Patient');
var Doctor = require('../models/Doctor');
var Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  AssistantController=require('../controllers/AssistantController');

/* GET users listing. */
router.get('/',authenticataToken, function(req, res, next) {

  User.find(function (err,data){
    if(err) throw err;
    res.status(200).send({users:  data, message: "success"});
    // res.render('index', {title : 'this is user api'});
  });

});

router.post('/addUser', async function (req, res, next) {
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
  if(req.body.Role == "Patient"){
    console.log("new patient");
    var patient = new Patient({
      height : req.body.height
    });
    patient.save();
    user._patient= patient._id;
  }
  else if (req.body.Role == "Doctor"){
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
    doctor.save();
    user._doctor= doctor._id;
  }
  else if (req.body.Role == "Assistant"){
    console.log("new Assistant");
    var assistant = new Assistant({
      Speciality: req.body.Speciality,
      Description: req.body.Description,
      ActsAndCare: req.body.ActsAndCare
    });
    assistant.save();
    user._assistant= assistant._id;
  }
  user.Role = req.body.Role;
  user.save();
  res.status(200).send(user);
})

router.post("/login", async (req,res)=>{
  try{
    const {Email,Password} = req.body;
    var restUserInfo = null;
    if(!(Email && Password)){
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({Email});
    if(user&&(await bcrypt.compare(Password,user.Password))){
      if(user.Role == "Patient"){
        restUserInfo = user._patient;
      }
      else if(user.Role == "Doctor"){
        restUserInfo = user._doctor;

      }
      else if(user.Role == "Assistant"){
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
});

function authenticataToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token,process.env.JWT_KEY,(err,user)=>{
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/addPatient', async function (req, res, next) {

  var user = new Patient({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: await bcrypt.hash(req.body.Password,10),
    Address: req.body.Address,
    Picture: req.body.Picture,
    Phone: req.body.Phone,
    listeRdv: req.body.listeRdv
  })
  user.save();
  res.status(200).send(user);
})

/* GET assistants listing. */
router.get('/getassistants',AssistantController.getAllAssistants)

/* GET assistant by id. */
router.get('/getassistants/:id',AssistantController.getAssistantByID)

/* Edit an assistant by id. */
router.put('/editassistant/:id',AssistantController.EditAssistantByID)

/* delete assistant by id. */
router.delete('/deleteassistants/:id',AssistantController.DeleteAssistantsById)

/* delete All assistants */
router.delete('/deleteassistant',AssistantController.DeleteAllAssistants)


exports.DeleteAllAssistants=(req,res)=>{
  Assistant.remove(function(err,data) {
    if(err) throw err;
    res.status(200).send(data);

  });

}
module.exports = router;
