var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wasteCollectionSchema = new Schema({
  areaNo: String,
  name: String,
  recycle_sch: String, //ISO date
  green_sch: String, //ISO date
  landfill_sch: String, //ISO Date
  lgaboundariesRef: {
    type: Schema.ObjectId,
    ref: 'lgaboundaries'
  },
  created: Date,
  updated: Date,
  isActive: Boolean,
  isArchived: Boolean
});

var wasteCollectionSchedule = mongoose.model("wasteCollectionSchedule", wasteCollectionSchema);
module.exports = wasteCollectionSchedule;
