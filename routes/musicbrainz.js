var express = require('express');
var router = express.Router();
var request = require('request');
var mbConfig = require('../config/mbConfig');
var mbURL = mbConfig.musicbrainz.host + ':' + mbConfig.musicbrainz.port;

router.all('/test',function(req, res){
	// var method = req.method.toUpperCase();
	// var proxy_url = "http://" + mbURL + '/ws/2/recording?query="welcome to new york" AND artist:"taylor swift"&fmt=json';
	var proxy_url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?tpl=3&page=detail&date=2018-05-08&topid=4&type=top&song_begin=0&song_num=10';
	console.log(proxy_url);
	var options = {
		headers: {"Connection": "close"},
		url: proxy_url,
		method: 'GET',
		json: true,
		body: req.body
	};

	function callback(error, response, data) {
		if (!error && response.statusCode == 200) {
			res.json(data)
		}
	}

	request(options, callback);
});

module.exports = router;