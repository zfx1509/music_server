var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var statisticsRouter = require('./routes/statistics');
var rankRouter = require('./routes/rank');
var musicbrainzRouter = require('./routes/musicbrainz');
var databaseRouter = require('./routes/database');
var levelsRouter = require('./routes/levels');
var dimensionRouter = require('./routes/dimension');

// 定时任务
require('./schedule/getTopSongs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/statistics', statisticsRouter);
app.use('/rank', rankRouter);
app.use('/musicbrainz', musicbrainzRouter);
app.use('/database', databaseRouter);
app.use('/levels', levelsRouter);
app.use('/dimension', dimensionRouter);

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

app.listen(3000,function () {
	console.log('Server started on http://localhost:3000  .......');
});

module.exports = app;


