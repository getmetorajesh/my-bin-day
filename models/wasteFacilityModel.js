var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WasteFacilitySchema = new Schema({
  geometry: Schema.Types.Mixed,
  type: String,
  properties: Schema.Types.Mixed,
});

var wasteFacility = mongoose.model('wastecollectionfacilities', WasteFacilitySchema);
module.exports = wasteFacility;
