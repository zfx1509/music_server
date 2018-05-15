var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicConfig');
var pool = mysql.createPool(dbConfig.mysql);

/* GET home page. */
router.get('/', function (req, res, next) {
	res.sendFile('index.html');
});

router.post('/tests', function (req, res, next) {
	var data = [];
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			for (var i = 0; i <= 100; i++) {
				connection.query("SELECT * FROM singertop WHERE artist_id = " + (i + 1),
					function (error, rows, fields) {
						if (error) {
							console.log(error);
							return res.status(500).json({
								error: error
							});
						} else {
							for (var j = 0; j < rows.length; j++) {
								data.push([i-1,j,rows[j].artist_moving]);
							}
						}
					});
				console.log(data);
			}
			connection.release();
			return res.status(200).json({
				data: data
			});
		}
	});
});

module.exports = router;
