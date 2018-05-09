var express = require('express');
var cassandra = require('cassandra-driver');
var async = require('async');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], keyspace: 'demo'});
  client.execute("SELECT sales, year FROM sales", function (err, result) {
    if (!err){
        if ( result.rows.length > 0 ) {
          sales = [];
          years = [];
          data = [];
          for(var i=0; i<result.rowLength; i++){
            sales.push(result.rows[i].sales);
            years.push(result.rows[i].year);
            var tuple = {};
            tuple["sale"] = result.rows[i].sales/10 + "";
            tuple["year"] = result.rows[i].year + "";
            data.push(tuple);
          }
          // console.log(sales);
          // console.log(years);
          console.log(data);
          res.render('index2', { title: 'Home', message: "connected!", sales: sales, years: years, data: data});
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

module.exports = router;
