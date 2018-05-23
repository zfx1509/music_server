var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/getNetEasyUgd', function (req, res, next) {
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			var sql = 'SELECT id,play_count,collect_count,share_count,comment_count FROM wy';
			connection.query(sql,
				function (error, rows) {
					if (error) {
						console.log(error);
						return res.status(500).json({
							error: error
						});
					} else {
						connection.release();
						var data = [];
						var id = [];
						rows.forEach(function (row) {
							id.push(row.id);
							data.push([row.play_count,row.collect_count,row.share_count,row.comment_count])
						});
						return res.status(200).json({
							id: id,
							data: data
						});
					}
				});
		}
	});
});
router.post('/getNetEasyDouble', function (req, res, next) {
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(200).json({
				error: error
			});
		} else {
			connection.query("SELECT * FROM wy_double",
				function (error, rows, fields) {
					if (error) {
						console.log(error);
						return res.status(200).json({
							error: error
						});
					} else {
						connection.release();
						return res.status(200).json({
							data: rows
						});
					}
				});
		}
	});
});
module.exports = router;