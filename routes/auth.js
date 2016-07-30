var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();
var secret = require('../config/secret');

var auth = {
  loginView: function(req, res){
    res.render('login',{});
  },
  login: function(req, res){

    console.log(req.body);
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({'status':401, 'message': 'Invalid Credentials'});
      return;
    }
    // query db to check if credentials are valid
    var dbUserObj = auth.validate(username, password);

    if (!dbUserObj) {
      res.status(401);
      res.json({
        'status': 401,
        'message': 'Invalid credentials'
      });
      return;
    }

    if (typeof dbUserObj.username != 'undefined') {
      // then lets generate a token
      res.send(genToken(dbUserObj));
    } else {
      res.send({status: 'failed', message: 'Login failed'}, 400);
    }
  },

  validate: function(username, password) {
    var dbUserObj = { // dummy user obj
      name: 'Nick Fury',
      role: 'admin',
      username: 'fury'
    };
    if(username === 'fury' && password === 'shield')
      return dbUserObj;
    else
      return {};
  },

  validateUser: function(username){
      var dbUserObj = {
        name: 'Nick Fury',
        role: 'admin',
        username: 'fury'
      };
      return dbUserObj;
  }
};


//private
function genToken(user){
  var expires = expiresIn(7);
  var payload = {
    user: user,
    exp: expires
  };
  var token = jwt.encode(payload, secret.secret_hash);

  return {
   token: token,
   expires: expires,
   user: user
 };
}

function expiresIn(numDays){
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
