var jwt = require('jwt-simple');
var validateUser = require('../routes/auth').validateUser;
var secret = require('../config/secret');

module.exports = function(req, res, next){

  // when performing a CORS, we will receive a preflighted request first, this is to check if our app is safe

  // we skip the token auth for [OPTIONS ] request

  if (req.method == 'OPTIONS') next();

  //var token = (req.body && req.body.access_token) || (req.query && req.query.x-access-token) || req.headers['x-access-token'];
//  var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
  var token = req.headers['x-access-token'];
  var key =  req.headers['x-key'];
  console.log(key);
  if (token || key) {
    try{
      var decoded = jwt.decode(token, secret.secret_hash);

      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }

      // Authorize the user to see if they can access our resources

      var dbUser = validateUser(key);

      if (dbUser) {
         if (req.url.indexOf('api') >= 0) {
        //if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('api') >= 0)) {
          next();
        }else{
          res.status(403);
          res.json({
            "status": 403,
            "message": "Not Authorized"
          });
          return;
        }
      } else {
        // User exists with the username .. 401
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid user"
        });
        return;
      }

    }catch (err){
      res.status(500);
      res.json({
      "status": 500,
      "error": err
    });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }

}
