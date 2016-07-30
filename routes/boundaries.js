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


router.get('/', function(req, res, next) {
  LGABoundary.find({'isArchived':false},'geometry -_id type', function(error, boundaries){
    var resultSet = {};
    resultSet.type = 'FeatureCollection';
    resultSet.features = boundaries;
    res.send(resultSet);
  });
});


module.exports = router;
