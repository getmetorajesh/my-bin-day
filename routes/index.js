'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LGABoundary = require(__dirname + '/../models/lgaBoundaryModel');
var WasteCollectionSchedule = require(__dirname + '/../models/wasteCollectionScheduleModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: ' ' });
});



module.exports = router;
