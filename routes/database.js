var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/systemdbConfig');
var pool = mysql.createPool(dbConfig.mysql);


// 测试数据库连通性
router.post('/ping', function (req, res, next) {
	var dbTestConfig = req.body;
	var testPool = mysql.createPool(dbTestConfig);
	testPool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(200).json({
				status: "error",
				error: error
			});
		} else {
			connection.release();
			return res.status(200).json({
				status: "success"
			});
		}
	});
});

// 添加数据源
router.post('/addDatabase', function (req, res, next) {
	var config = JSON.stringify(req.body);
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(200).json({
				error: error
			});
		} else {
			connection.query("INSERT INTO database_list(name,config) VALUES (?,?) ",
				[req.body.database, config],
				function (error, result) {
					if (error) {
						console.log(error);
						return res.status(200).json({
							status: "error",
							error: error
						});
					} else {
						connection.release();
						return res.status(200).json({
							status: "success",
							data: result
						});
					}
				});
		}
	});
});

// 获取数据源
router.post('/getDatabaseList', function (req, res, next) {
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			connection.query("SELECT * FROM database_list",
				function (error, rows, fields) {
					if (error) {
						console.log(error);
						return res.status(500).json({
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

// 返回数据表
router.post('/getTableList', function (req, res, next) {
	var id = req.body.id;
	pool.getConnection(function (error, connection) {
		if (error) {
			console.log(error);
			return res.status(500).json({
				error: error
			});
		} else {
			connection.query("SELECT (config) FROM DATABASE_LIST WHERE id = " + id,
				function (error, rows, fields) {
					if (error) {
						console.log(error);
						return res.status(500).json({
							error: error
						});
					} else {
						connection.release();
						var config = JSON.parse(rows[0].config);
						var dbPool = mysql.createPool(config);
						dbPool.getConnection(function (error, connection) {
							if (error) {
								console.log(error);
								return res.status(500).json({
									error: error
								});
							} else {
								connection.query('SHOW TABLES', function (error, rows) {
									if (error) {
										console.log(error);
										return res.status(500).json({
											error: error
										});
									} else {
										connection.release();
										var data = [];
										for (var key in rows[0]){
											var keyName = key;
										}
										for (var i = 0; i < rows.length; i++) {
											data.push(
												{
													key: i + 1,
													idx: i + 1,
													tName: rows[i][keyName]
												}
											)
										}
										return res.status(200).json({
											data: data,
											total: i
										});
									}
								})
							}
						});
					}
				});
		}
	});
});

module.exports = router;
