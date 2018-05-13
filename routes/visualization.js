var express = require('express');
var cassandra = require('cassandra-driver');
var async = require('async');
var router = express.Router();


router.get('/word_cloud', function(req, res, next) {
	res.render('wordcloud', { title: 'Word Cloud'});
});

router.get('/heat_map', function(req, res, next) {
	res.render('heatmap', { title: 'Heat Map'});
});

router.get('/bar_index', function(req, res, next) {
	const query = "SELECT * FROM congress_prediction WHERE topicname='congress_karnataka' ORDER BY time ASC ";
	var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], keyspace: 'prediction'});
	data = [];
	data1 = [];
	threshold = new Date();
	threshold.setFullYear(2018, 4, 12);
	//var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var min = 99999999;
	var max = -999999999;
	var minTime = threshold

	client.eachRow(query, [], { autoPage: true }, function (err, row) {
		
			var tuple = {};
			var time = new Date(row.time);
			tuple["x"] = time;
			tuple["y"] = row.topicpotential;
			data.push(tuple);
			
			if(row.topicpotential < min){
				min = row.topicpotential;
			}

			if(time < minTime){
				minTime = time;
			}

			if(row.topicpotential > max){
				max = row.topicpotential;
			}
	
	}, function(){
		var a = max;
		var b = (min - max)/ Math.pow(threshold.getTime() - minTime.getTime(), 0.1);

		for(var i=0; i<data.length; i++){
			var tuple1 = {};
			var time = new Date(data[i]["x"]);
			
			var diffDays = Math.abs((threshold.getTime() - time.getTime()));
			tuple1["x"] = time;
			tuple1["y"] = a + (b * Math.pow(diffDays, 0.1));
			data1.push(tuple1);
		}
		console.log(data1)
		res.render('barindex', { title: 'Bar Index', data: data, data1: data1});
	});
});

router.get('/', function(req, res, next) {
	res.render('visualization', { title: 'Visualization'});
});

module.exports = router;
