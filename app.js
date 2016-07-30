var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var fs            = require('fs');
var routes        = require('./routes/index');
var users         = require('./routes/users');
var council         = require('./routes/council');
var secret = require('./config/secret');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var importManager = require('./routes/importManager');
var collectionSchedule = require('./routes/collectionSchedule');
var boundaries = require('./routes/boundaries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'jade');
app.set('superSecret', secret.secret_hash);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next){
  //CORS header
  res.header('Access-Control-Allow-Origin','*'); //restrict to this particular domain
  res.header('Access-Control-Allow-Methods','GET,PUT, POST,DELETE, OPTIONS');
  //Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  }else{
    next();
  }
});

// app.get('/admin', auth.loginView);
// app.post('/admin', auth.login);

app.all('/api/*', [require('./middlewares/validateRequest')]);

app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);
app.use('/api/importer', importManager);
app.use('/api/council', council);
app.use('/collectionSchedule', collectionSchedule);
app.use('/boundaries', boundaries);

//console.log(app._router.stack);

if (app.get('env') == 'development') {
  //  app.use(express-error-Handler());
  mongoose.connect('mongodb://localhost:27017/app_ambitious')
}

// load all models file
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname +"/models/"+filename)
});

app.get('/users2', function(req,res){
  mongoose.model('users').find(function(error, users){
    res.send(users);
  });
});

app.get('/posts/:userid', function(req,res){
  mongoose.model('posts').find({user:req.params.userid},function(error, posts){
    mongoose.model('posts').populate(posts, {path:'user'}, function(err, posts){
      res.send(posts);
    })
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
