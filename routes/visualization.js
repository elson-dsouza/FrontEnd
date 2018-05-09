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
	var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], keyspace: 'prediction'});
	client.execute("SELECT * FROM prediction WHERE topic='bjp_karnataka' ORDER BY time ASC ", function (err, result) {
		if (!err){
			console.log(result.rows.length + "");
			if ( result.rows.length > 0 ) {
				data = [];
				data1 = [];
				threshold = new Date();
				threshold.setFullYear(2018, 4, 18);
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

				var min = 99999999;
				var max = -999999999;

				for(var i=0; i<result.rows.length; i++){
					var tuple = {};
					var tuple1 = {};
					var time = new Date(result.rows[i].time);
					if(time.getTime() < threshold.getTime()){
						tuple["x"] = time;
						tuple["y"] = result.rows[i].topicpotential + "";
						data.push(tuple);

						if(result.rows[i].topicpotential < min){
							min = result.rows[i].topicpotential;
						}
						if(result.rows[i].topicpotential > max){
							max = result.rows[i].topicpotential;
						}
					}
				}

				var a = max;
				var b = (min - max)/ Math.pow(result.rows.length, 0.1);

				for(var i=0; i<result.rows.length; i++){
					var tuple1 = {};
					var time = new Date(result.rows[i].time);

					if(time.getTime() < threshold.getTime()){
						var diffDays = Math.round(Math.abs((threshold.getTime() - time.getTime())/(oneDay)));
						tuple1["x"] = time;
						tuple1["y"] = a + b * Math.pow(diffDays, 0.1) + "";
						data1.push(tuple1);
					}
				}

				res.render('barindex', { title: 'Bar Index', data: data, data1: data1});
			} else {
				res.render('index2', { title: 'Home', message: 'No results'});
			}
		}
		else{
			res.render('error', { title: 'Error', message: err});
			console.log(err);
		}
	});
});

router.get('/', function(req, res, next) {
	res.render('visualization', { title: 'Visualization'});
});

module.exports = router;
