/**
  * Parsing the waste collection recurring dates
  * inspired by John Rocela
  * written by Raj Krish
  */

var moment = require('moment');
require('moment-recur');
var ISODateDuration = function(string){
  //default
  this.repeat = null;
  this.duration = null;
  this.date = moment();

  try {
    console.log("iso date"+string);
    var date = this.parse(string);
    this.repeat = date.repeat;
    this.date = moment(date.date);
    this.duration = moment.duration(date.duration);

  } catch (err) {
    throw new Error(err);
  }

}

ISODateDuration.prototype.parse = function(isoRecuringDate){
  var recurringDateElements = isoRecuringDate.split('/');
  var result = {};

  //Rn
  result.repeat = recurringDateElements[0].match(/R(\d)?/g);
  //date
  result.date = recurringDateElements[1];
  result.duration = recurringDateElements[2];
  result.duration = (result.duration === 'PW') ? 'P1W' :  result.duration;
  return result;
}


ISODateDuration.prototype.getRepeat = function() {
    return this.repeat;
}

ISODateDuration.prototype.getDate = function() {
    return (this.date);
  //return new Date(this.date);

}

ISODateDuration.prototype.getDuration = function() {
    return (this.duration);
}

ISODateDuration.prototype.getNextDate = function(n) {
    var date = this.getDate(),
      duration = this.getDuration(),
        dates = [];
    n = n || 1;
    //var recurrence = date.recur().every(duration.days(),'days');
    //nextDates = recurrence.next(3);
    //console.log(nextDates);
    while (n--) {
      var daysBetween = moment().diff(date)/86400000;
      var weeks = Math.round(duration.days() / 7);
      var dayInterval = 7 * weeks;
      console.log(daysBetween+" - "+dayInterval);
      var nextCollectionIn = (dayInterval - daysBetween+1) %(dayInterval);
      console.log("days till+="+nextCollectionIn);
      var copy = moment().add(Math.abs(nextCollectionIn), "days").format("DD-MM-YYYY");
      console.log(copy);
      //var copy = new Date(date);
      dates.push(copy);
    }
    return (dates.length == 1) ? dates[0]: dates;

  }

// Expose the API
module.exports = ISODateDuration;
