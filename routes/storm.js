var express = require('express');
var cassandra = require('cassandra-driver');
var async = require('async');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('storm', { title: 'Storm'});
});

module.exports = router;
