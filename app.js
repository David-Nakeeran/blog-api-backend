const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const usersRouter = require('./routes/users');

const app = express();

// Mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB;

const main = async function() {
  await mongoose.connect(mongoDB);
};

const connectToMongoDB = async function() {
  try {
    await main();
  } catch(error) {
    console.error("Error connecting to MongoDB:", error)
  }
};
connectToMongoDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/posts', postRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // Checks if in dev mode
  if(req.app.get('env') === 'development') {
    res.json({
      message: err.message,
      error: err,
    });
  } else {
    res.json({
      message: err.message,
      error: {},
    });
  }
});

module.exports = app;
