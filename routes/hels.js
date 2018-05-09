,{
	|              label: 'asset bubble',
	|              data: !{JSON.stringify(data1)},
	|              backgroundColor: [
	|                  'rgba(255, 99, 132, 0.2)'
	|              ],
	|              borderColor: [
	|                  'rgba(255, 99, 132, 0.2)'
	|              ],
	|              borderWidth: 1
	|          }


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
	var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], keyspace: 'project'});
	client.execute("SELECT * FROM topicseries where topicid = 'bjp_karnataka' order by time desc;", function (err, result) {
		if (!err){
			if ( result.rows.length > 0 ) {
				var data = [];
				var data1 = [];
				// var time;
				// var diffDays;
				// var threshold = new Date();
				// threshold.setFullYear(2018, 4, 17);
				// var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
				// var secondDate = new Date(2008,01,22);
				

				for(var i=0; i<result.rowLength; i++){
					var tuple = {};
					var tuple1 = {};
					time = new Date(result.rows[i].time);
					// if(time < threshold){
						// diffDays = Math.round(Math.abs((threshold.getTime() - time.getTime())/(oneDay)));

						tuple["t"] = time;
						tuple["y"] = result.rows[i].topicpotential + "";

						// tuple1["t"] = time;
						// tuple1["y"] = result.rows[i].a + result.rows[i].b * Math.pow(diffDays, 0.1) + "";

						data.push(tuple);
						// data1.push(tuple1);
					// }
				}

				console.log(data);
				console.log(data1);
				res.render('barindex', { title: 'Bar Index', data: data});
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
