var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/getNetEasyUgd', function (req, res, next) {
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(200).json({
				error: error
			});
		} else {
			connection.query("SELECT * FROM wy_para",
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