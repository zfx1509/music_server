var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/getArtistTree', function (req, res, next) {
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(200).json({
				error: error
			});
		} else {
			connection.query("SELECT * FROM qq_tree WHERE singer = '周杰伦'",
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