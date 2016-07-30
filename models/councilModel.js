var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var councilSchema = new Schema({
  councilName: String,
  email: String,
  uniqueName: String,
  sourceType: String,
  sourceVal: String,
  lastImportedAt: Date,
  created: Date,
  updated: Date,
  isActive: Boolean,
  isArchived: Boolean
});

var council = mongoose.model('councils', councilSchema);
module.exports = council;
