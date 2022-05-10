var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const productsRoutes = require('./routes/products-routes');
const couponsRoutes = require('./routes/coupons-routes');
const reviewsRoutes = require('./routes/reviews-routes');
const HttpError = require('./models/http-error');

// connection to DataBase
var mongoose = require("mongoose");
var config = require('./database/db.json');

mongoose.connect(config.mongo.uri,{
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true},
	()=> console.log('data base connection success')
)

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/MagazineRouter/articleRouter");
var forumRouter = require("./routes/ForumRouter/forumRouter");
var MedicalFileRouter = require("./routes/MedicalFileRoutes");
var doctorRouter = require("./routes/doctor");
var addedRouter = require("./routes/addedPatients");
const bodyParser = require("body-parser");

var app = express();

// cross origin allow
app.set("views", path.join(__dirname, "views"));
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use('/api/products/stripe/webhook', bodyParser.raw({type: "*/*"}))
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads/images', express.static(path.join('uploads', 'images')));



app.use((req, res, next) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

app.use("/api/products", productsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/", indexRouter);
app.use("/articles", articleRouter);
app.use("/users", usersRouter);
app.use("/forum", forumRouter);
app.use("/medicalFile", MedicalFileRouter);
app.use("/doctor", doctorRouter);
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/added", addedRouter);
//Connecting to the Mongo database
app.get("/", (req, res) => {
  mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to %s", MONGODB_URL);
      console.log("App is running ... \n");
      console.log("Press CTRL + C to stop the process. \n");
    })
    .catch((err) => {
      console.error("App starting error:", err.message);
      process.exit(1);
    });
});

var db = mongoose.connection;



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
