var express = require('express');
var cassandra = require('cassandra-driver');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], keyspace: 'project'});
  	client.execute("SELECT * FROM topicseries where topicid = 'bjp_karnataka' order by time desc limit 10;", function (err, result) {
		if (!err){
			if ( result.rows.length > 0 ) {
				for(var i=0; i<result.rowLength; i++){
					console.log(result.rows[i].year);
				}
				res.render('tweets', { title: 'Tweets'});
			} else {
				res.render('tweets', { title: 'no Tweets'});
			}
		}
		else{
		  res.render('error', { title: 'Error', message: err});
		  console.log(err);
		}
	});
});

module.exports = router;
