require("dotenv").config();
const express = require("express");

const app = express();

// Database connection
require("./models/database").connectedDatabase();

// logger
const logger = require("morgan");
app.use(logger("tiny"));

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieparser());

// express file-uploads

const fileupload = require("express-fileupload");
app.use(fileupload());

// routes
app.use("/user", require("./routes/indexRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/employe", require("./routes/employeRoutes"));

// error handling
const ErrorHandler = require("./utils/errorHandler");
const { generatedErrors } = require("./middlewares/errors");

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`requested URL not found ${req.url}`, 404));
});

app.use(generatedErrors);

// server
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});

module.exports = app;
