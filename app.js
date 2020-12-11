var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
// var fileUpload = require("express-fileupload");
var db = require("./dbFiles/connection");
// const flash = require("express-flash")
const session = require("express-session")
// cosnt passport
var userRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
// const passport = require("passport");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "Basic_Layout",
    layoutsDir: __dirname + "/views/",
    partialsDir: __dirname + "/views/Components/",
  })
);

// app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(flash())
app.use(session({
  secret:"HASHED",
  resave:false,
  saveUninitialized:false
}))
app.use("/", userRouter);
app.use("/admin", adminRouter);

// database connection
db.connect((err) => {
  if (err) console.log("Connection error" + err);
  else console.log("Database connected successfully");
});

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
