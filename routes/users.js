var express = require('express');
var router = express.Router();
var User = require('../models/User');
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get('/', function(req, res, next) {
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
  console.log(user);
  user.save();
  res.status(200).send("aslema");
})

module.exports = router;
