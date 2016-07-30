var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LGASchema = new Schema({
  geometry: Schema.Types.Mixed,
  type: String,
  council:{
    type: Schema.ObjectId,
    ref: 'councils'
  },
  created: Date,
  updated: Date,
  isActive: Boolean,
  isArchived: {type: Boolean, default: false }
});

var lgaBoundaries = mongoose.model('lgaBoundaries', LGASchema);
module.exports = lgaBoundaries;
