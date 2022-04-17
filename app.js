var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const productsRoutes = require('./routes/products-routes');
const reviewsRoutes = require('./routes/reviews-routes');
const HttpError = require('./models/http-error');

// connection to DataBase
var mongoose = require("mongoose");
var config = require('./database/db.json');
mongoose.connect(config.mongo.uri,{
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true},
	()=> {
		app.listen(5000, () => {
			console.log('server is running on port 5000');
		});
	}
)


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter= require('./routes/MagazineRouter/articleRouter');
var forumRouter= require('./routes/ForumRouter/forumRouter');

var app = express();

// cross origin allow
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/', indexRouter);
app.use('/articles', articleRouter);
app.use('/users', usersRouter);
app.use('/forum', forumRouter);



app.use((req, res, next) => {
	const error = new HttpError('could not find this route.', 404);
	res.status(error.code || 500)
	res.json({message: error.message || 'An unknown error occured'});
});

app.use(((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500)
	res.json({message: error.message || 'An unknown error occured'});
}));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
