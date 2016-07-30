'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var GeoJSON = require('geojson');
var gju = require('geojson-utils');
var mongoose = require('mongoose');
var async = require('async');
var moment = require('moment');
var LGABoundary = require(__dirname + '/../models/lgaBoundaryModel');
var WasteCollectionSchedule = require(__dirname + '/../models/wasteCollectionScheduleModel');
var fs = require('fs');
var ogr2ogr = require('ogr2ogr');


/* lets start importing */
router.get('/:uniqueName', function(req, res, next) {
  var wasteCollectionFormat = 'https://spreadsheets.google.com/feeds/list/1lGuZDgNSybGuA39FNRoaTzJGiPI69FY8MBYlUdriDpg/od6/public/values?alt=json'
  //'https://spreadsheets.google.com/feeds/list/1lGuZDgNSybGuA39FNRoaTzJGiPI69FY8MBYlUdriDpg/od6/public/values?alt=json';
  var uniqueName = req.params.uniqueName;
  console.log(new RegExp(uniqueName, 'i'));
  async.waterfall([

    //1. get the council info
    function(callback) {
      mongoose.model('councils').findOne({uniqueName: new RegExp('^' + uniqueName, 'i')}, function(error, councilInfo) {
        callback(null, councilInfo);
      });
    },
    function(councilInfo, callback) {
      //content format from google '$t': 'sourcetype: geojson, sourceval: http://data.gov.au/api/3/action/package_show?id=waste-collection-boundaries, green: Green_Sche, recycle: Recycle_Sc, landfill: Landfill_Sc, format: iso, egvalue: R/2015-01-08/PW'

        request(wasteCollectionFormat, function(error, response, body){
          var gSheetData = JSON.parse(body);
          var allCouncil = gSheetData.feed.entry;
          var metaDataArr = [];
          allCouncil.forEach(function(gCouncil){
            metaDataArr[gCouncil.title.$t]={
              'sourceType' : gCouncil.gsx$sourcetype.$t,
              'sourceVal' : gCouncil.gsx$sourceval.$t,
              'green' : gCouncil.gsx$green.$t,
              'recycle' : gCouncil.gsx$recycle.$t,
              'landfill' : gCouncil.gsx$landfill.$t,
              'dateFormat' : gCouncil.gsx$dateformat.$t,
              'egValue' : gCouncil.gsx$egvalue.$t,
              'infoUrl' : gCouncil.gsx$infourl.$t,
              'greenInfoUrl' : gCouncil.gsx$greeninfourl.$t,
              'recycleInfoUrl' : gCouncil.gsx$recycleinfourl.$t,
              'landfillInfoUrl' : gCouncil.gsx$landfillinfourl.$t
            };
          });
          
          // csv 
         //csvData()

          //if (councilInfo.sourceType === 'geojson') {
            geojsonData(councilInfo, metaDataArr[councilInfo.uniqueName]);
          //}
        });
    }
    //2. get the data for the council
  ], function(err, result) {
    if (err) {
      throw err;
    }else {
      //console.log(result);
    }

  });

  function geojsonData(council, metadata) {
    if(metadata.sourceType.toLowerCase() === 'geojson' || metadata.sourceType.toLowerCase() === 'json'){
      async.waterfall([
        function(callback){
          // 1. get metadata
          request(metadata.sourceVal, function(err, response, body){
            var availableResources = JSON.parse(body);
            availableResources = availableResources.result.resources;
            var jsonresource = availableResources.filter(function(el){
              return el.format.toLowerCase() === metadata.sourceType.toLowerCase()
            });
            callback(null, jsonresource[0], metadata);
          });
        },
        function(jsonResourceInfo, metadata, callback){
          request(jsonResourceInfo.url, function(error, response, body){
            if (!error && response.statusCode === 200) {
              var source = JSON.parse(body);

              if (source.type === 'FeatureCollection') {
                fs.readFile("/Users/preethi/Downloads/SurfCoast4326.json",'utf8', function(err, data){
                  source= JSON.parse(data);
                  //console.log(data);

                });
                  prepData(council, metadata, source);
              }
            }
          });
        }
    ]);
    }else{
      res.send({'status':'failed', 'message':'Unknown format'}, 500);
    }
  }

  /**
   * based on the council
   */
  function prepData(council, metadata, source){
  // Format the source data to the standard EPSG if its in a different format
    var geometryFormat = "EPSG::4326";
    if(typeof source.crs != 'undefined')
      geometryFormat = source.crs.properties.name;
    if (geometryFormat.indexOf("EPSG::4326") > -1){
      console.log("Cool.. its EPSG Format");
      saveToDB(source, council, metadata);
    }else{
      var sourceData = source;
      async.waterfall([
        function(callback){
          var reProjectedData = ogr2ogr(sourceData)
                                .format('GeoJSON')
                                .project('EPSG:4326');
          reProjectedData.exec(function(err, data){
            if (err) {
              console.log(err);
              throw err;
            }else{
              //console.log(data);
              callback(null, data);
            }
          });
        },
        function(reProjectedData, callback){
          saveToDB(reProjectedData, council, metadata);
        }
      ]);
    }
  }

  /*
    Save to DB
  */
  function saveToDB(source,council, metadata){
    // set old ones on the DB to archived
      var lgaBoundary = new LGABoundary();
    var bulk = lgaBoundary.collection.initializeOrderedBulkOp();
    bulk.find({"council":council._id}).update({ '$set':{'isArchived':true}});
    bulk.execute(function (error) {
      //TODO: callback();
      if (error) {
        console.log(error);
      }
    });

    // insert new data
    source.features.forEach(function(feature) {

      var lgaBoundary = new LGABoundary();
      var wasteCollectionSch = new WasteCollectionSchedule();
      wasteCollectionSch.lgaboundariesRef = lgaBoundary;
    //  console.log(metadata.dateFormat);

    //  wasteCollectionSch.areaNo = feature.properties.Area_No;
      switch(metadata.dateFormat){
        case 'date::weeks':
            var green_dt_format = metadata.green.split('::');
            var recycle_dt_frmt = metadata.recycle.split('::');
            var landfill_dt_format = metadata.landfill.split('::');
            console.log(green_dt_format);
            console.log(feature.properties);
            console.log(green_dt_format[0]);
            var green_sch = getRecurringDateFormat(feature.properties[green_dt_format[0]],feature.properties[green_dt_format[1]]);
            var recycle_sch = getRecurringDateFormat(feature.properties[recycle_dt_frmt[0]],feature.properties[recycle_dt_frmt[1]]);
            var landfill_sch = getRecurringDateFormat(feature.properties[landfill_dt_format[0]],feature.properties[landfill_dt_format[1]]);

            wasteCollectionSch.green_sch = green_sch;
            wasteCollectionSch.recycle_sch = recycle_sch;
            wasteCollectionSch.landfill_sch = landfill_sch;

          break;
        case 'yyyy-mm-dd':

        case 'iso_recurring':
          wasteCollectionSch.green_sch = feature.properties[metadata.green];
          wasteCollectionSch.recycle_sch = feature.properties[metadata.recycle];
          wasteCollectionSch.landfill_sch = feature.properties[metadata.landfill];
        break;
      }
    //  console.log(wasteCollectionSch);
      lgaBoundary.geometry = feature.geometry;
      lgaBoundary.type = 'Feature';
      lgaBoundary.council = council;
      council.lastImportedAt = Date();
      wasteCollectionSch.save();
      lgaBoundary.save(function(err){
        if (err) {
          res.send({status: 'failed', error:err}, 500);
        }
        council.save();
        res.send({status: 'success'});

      });

    });
  }


  function getRecurringDateFormat(date, weeks){
    console.log(date + ' ' + weeks);
    return 'R/' + moment(new Date(date)).format('YYYY-MM-DD') + '/P' + weeks + 'W';
  }

});

module.exports = router;
