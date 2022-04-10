var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MONGODB_URL = "mongodb+srv://nosnos:healthbloompw@healthbloom.b38oy.mongodb.net/healthbloom" ;
var mongoose = require("mongoose");
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter= require('./routes/MagazineRouter/articleRouter');
var forumRouter= require('./routes/ForumRouter/forumRouter');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(cors({
  origin: 'http://localhost:3000'
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

//Our static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/articles', articleRouter);
app.use('/users', usersRouter);
app.use('/forum', forumRouter);

//Connecting to the Mongo database
app.get('/',(req,res)=>{
  mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
)
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
  res.render('index')
  
})

var db = mongoose.connection;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
