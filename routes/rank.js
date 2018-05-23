var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicConfig');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/getRank', function (req, res) {
	console.log(req.body);
	var begin = req.body.begin || 0;
	var length = req.body.length || 25;
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			var sql = "SELECT rank,title,author,album,play,xiami_hot FROM xiami limit " + begin + "," + length + ";";
			connection.query(sql,
				function (error, rows) {
					if (error) {
						console.log(error);
						return res.status(500).json({
							error: error
						});
					} else {
						var data = rows;
						connection.query('SELECT count(rank) FROM xiami;',
							function (error, rows) {
								if (error) {
									console.log(error);
									return res.status(500).json({
										error: error
									});
								} else {
									connection.release();
									return res.status(200).json({
										data: data,
										count: rows[0]['count(rank)']
									});
								}
							});
					}
				});
		}
	});
});

router.post('/getDetail', function (req, res) {
	var rank = req.body.rank;
	console.log(req.body);
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			var sql = "SELECT * FROM xiami WHERE rank = " + rank + ";";
			connection.query(sql,
				function (error, rows) {
					if (error) {
						console.log(error);
						return res.status(500).json({
							error: error
						});
					} else {
						return res.status(200).json({
							data: rows
						});
					}
				});
		}
	});
});

module.exports = router;