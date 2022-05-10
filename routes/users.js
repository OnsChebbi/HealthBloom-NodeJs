require("dotenv").config();
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const patientController = require ('../controllers/PatientController');
const jwt = require("jsonwebtoken");

router.get('/',authenticateToken,userController.getAll);
router.post('/addUser',userController.addUser);
router.post("/login", userController.login);
router.get('/getById/:id', userController.getById);
router.post('/updateUser/:id', userController.updateUser);
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

module.exports = router;
