require("dotenv").config();
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const patientController = require ('../controllers/PatientController');
var User = require('../models/User');
var Patient = require('../models/Patient');
var Doctor = require('../models/Doctor');
var Assistant = require('../models/Assistant');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  AssistantController=require('../controllers/AssistantController');


router.get('/',authenticateToken,userController.getAll);
router.post('/addUser',userController.addUser);
router.post("/login", userController.login);
router.get('/getById/:id', userController.getById);
router.post ('/updateUser/:id', userController.updateUser);
router.post('/changePassword/:id', userController.changePassword);
router.post('/forgetPassword', userController.resetPasswordRequest);
router.post('/resetForgottenPassword', userController.resetForgottenPassword);
router.post('/googleLogin',userController.googleAuth);
router.post('/completeProfile/:id',userController.completeProfile);

router.get('/deleteUser/:id',userController.deleteUser);
router.get('/getAllPatients',userController.getAllPatients);
router.post('/updatePatient/:id', patientController.updatePatientAction);
router.get('/deletePatient/:id',patientController.deletePatient);

function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token,process.env.JWT_KEY,(err,user)=>{
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/* GET assistants listing. */
//router.get('/getassistants',AssistantController.getAllAssistants)

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
