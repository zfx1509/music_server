var schedule = require('node-schedule');
var request = require('request');
var moment = require('moment');
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var pool = mysql.createPool(dbConfig.mysql);

var j = schedule.scheduleJob('0 0 12 * * *', function () {
  var today = moment().format('YYYY-MM-DD').toString();
  console.log(today);
  var proxy_url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?tpl=3&page=detail&date=' + today + '&topid=4&type=top';
  console.log(proxy_url);
  var options = {
    headers: {"Connection": "close"},
    url: proxy_url,
    method: 'GET',
    json: true
  };

  function callback(error, response, data) {
    if (!error && response.statusCode === 200) {
      var songList = data.songlist;
      var values = [];
      for (var i = 0; i < songList.length; i++) {
        var singerArr = [];
        for (var j = 0; j < songList[i].data.singer.length; j++) {
          singerArr.push(songList[i].data.singer[j].name);
        }
        var singer = singerArr.join(',');
        values.push([today, i + 1, songList[i].data.albummid, songList[i].data.albumname, songList[i].data.songname,
          singer, songList[i].in_count,songList[i].Franking_value]);
      }
      pool.getConnection(function (error, connection) {
        if (error) {
          console.log(error);
          return 0;
        } else {
          connection.query("INSERT INTO daily_top(`date`,`rank`,`aid`,`album`,`title`,`singer`,`hot`,`play_count`) VALUES ?",
            [values],
            function (error, rows, fields) {
              if (error) {
                console.log(error);
                return 0;
              } else {
                connection.release();
                console.log("INSERT SUCCESS");
              }
            });
        }
      });
    }
  }

  request(options, callback);
});