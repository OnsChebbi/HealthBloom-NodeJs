require("dotenv").config();
var express = require('express');
var router = express.Router();
var User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    Phone: req.body.Phone
  })
  user.save();
  res.status(200).send(user);
})

router.post("/login", async (req,res)=>{
  try{
    const {Email,Password} = req.body;
    if(!(Email && Password)){
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({Email});
    if(user&&(await bcrypt.compare(Password,user.Password))){
      const token = jwt.sign(
          { user_id: user._id, Email },
          process.env.JWT_KEY,
          {
            expiresIn: "2h",
          }
      );
      user.Token = token;
      res.status(200).json(user);
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


module.exports = router;
