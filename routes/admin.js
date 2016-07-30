var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var fs            = require('fs');
var router = express.Router();
var auth = require('./auth');

router.get('/', auth.loginView);
router.post('/', auth.login);

router.get('/import', function(req, res, next) {
  res.render('importView', {});
});

module.exports = router;
