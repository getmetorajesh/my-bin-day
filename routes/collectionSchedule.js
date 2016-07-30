'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var GeoJSON = require('geojson');
var gju = require('geojson-utils');
var mongoose = require('mongoose');
var async = require('async');
var LGABoundary = require(__dirname + '/../models/lgaBoundaryModel');
var WasteCollectionSchedule = require(__dirname + '/../models/wasteCollectionScheduleModel');
var ISODateDuration = require(__dirname + '/../lib/ISODateDuration');
var moment = require('moment');
///var iiso8601 = require('node-iso8601');

// Create a new ISO8601 date
//console.log('This date will invoke something on ' + isoDate.getNextDate());
/* lets start importing */

var isoDate = new ISODateDuration("R/2015-01-15/P1W");
console.log(isoDate.getNextDate());


//var intervals = isoDate.getNextDate(5);
// intervals.forEach(function(interval) {
//   //  console.log('Interval on ' + interval.format('YYYY-MM-DD HH:mm:ss'));
// });

router.post('/', function(req, res, next) {
    function findLGABoundaryFor(latitude, longitude){
      var query = LGABoundary.findOne({
        geometry:{
          $geoIntersects:{
            $geometry:{
              type:"Point",
              coordinates: [longitude, latitude]
              }
            }
          }
      });
      return query;
    }

    var bodyParams = req.body;

    //bodyParams.address
    console.log(bodyParams);
    if (bodyParams.latitude !== '' && bodyParams.longitude !== '') {
      var gaddress = JSON.parse(bodyParams.gaddress);
      var latitude = parseFloat(bodyParams.latitude); //address.geometry.location.G; // bodyParams.latitude;
      var longitude = parseFloat(bodyParams.longitude);// gaddress.geometry.location.K;//
      // if the body params has gaddress then assuming its from address and so parse and use them
      // if(gaddress !== ""){
      //     latitude = gaddress.geometry.location.lat;
      //     longitude = gaddress.geometry.location.lng;
      // }
      
      console.log("******");
      console.log(gaddress);
      var boundaryQuery = findLGABoundaryFor(latitude, longitude);
      boundaryQuery.exec(function(err, boundary){
        console.log(boundary);
        if (boundary == null) { // == null will check for both null and undefined
          res.send({
                  green_sch: "Unknown",
                  landfill_sch: "Unknown",
                  recycle_sch: "Unknown",
                });
        }else{
          var boundaryId = mongoose.Types.ObjectId(boundary._id);
          WasteCollectionSchedule.findOne({ lgaboundariesRef: boundaryId}, function(error, schedule){
            console.log(schedule);
            var nextSchedule = {};
            try{ 
                nextSchedule.green = new ISODateDuration(schedule.green_sch).getNextDate();
                nextSchedule.landfill = new ISODateDuration(schedule.landfill_sch).getNextDate();
                nextSchedule.recycle = new ISODateDuration(schedule.recycle_sch).getNextDate();
            } catch (err) {
              console.log("ERROR: "+err);
                //throw new Error(err);
            }
            console.log(nextSchedule);
            res.send(nextSchedule);
          });
        }
      });
    }

});

module.exports = router;
