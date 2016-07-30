var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
  content:String,
  user: {
    type:Schema.ObjectId,
    ref: 'users'
  }
//  user: Schema.user
});

mongoose.model("posts",postsSchema);
