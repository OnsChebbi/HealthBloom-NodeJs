var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }),
  res.set('Access-Control-Allow-Origin', '*');
});

module.exports = router;
