'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LGABoundary = require(__dirname + '/../models/lgaBoundaryModel');
var councilModel = require(__dirname + '/../models/councilModel');
var WasteCollectionSchedule = require(__dirname + '/../models/wasteCollectionScheduleModel');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  function getBoundary(council) {
    console.log(council);
    var boundaryPromise = LGABoundary.find({council: council._id, isArchived:false});
    return boundaryPromise;
  }

  async.waterfall([
    function(callback){
      // 1. get metadata
        councilModel.find({}, function(err, data){
          if (err) {
            throw err;
          }
          callback(null, data);
        });
    },
  function(councilList, callback) {
    var councilWithBoundaries = [];
    councilList.forEach(function(council) {
      var query = getBoundary(council);
      query.exec(function(err, boundary) {
        var councilObj = council.toObject();
        councilObj.boundaries = boundary;
        councilWithBoundaries.push(councilObj);
        if(councilWithBoundaries.length === councilList.length){
          callback(null, councilWithBoundaries);
        }
      });
    });
  //  console.log(councilWithBoundaries);
  }
], function(err, result){
  //console.log(result);
  res.send(result);
});
});

module.exports = router;
