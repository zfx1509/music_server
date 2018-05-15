var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var request = require('request');
var moment = require('moment');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/getStatistics', function (req, res) {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      var sql = 'SELECT * FROM `statistics` ORDER BY id DESC limit 3;';
      connection.query(sql, function (error, rows) {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: error
          });
        } else {
          connection.release();
          var data = {};
          for (var i = 0; i < rows.length; i++) {
            data[rows[i].type] = rows[i].count;
          }
          return res.status(200).json(data);
        }
      })
    }
  });
});

router.post('/getHistoryStatistics', function (req, res) {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      var sql = 'SELECT * FROM `statistics`;';
      connection.query(sql, function (error, rows) {
        if (error) {
          console.log(error);
          return res.status(500).json({
            error: error
          });
        } else {
          connection.release();
          var data = {
            date: [],
            qq: [],
            wy: [],
            xm: [],
            total:[]
          };
          var total = 0;
          for (var i = 0; i < rows.length; i++) {
            if (i === 0) {
              data.date.push(rows[0].date);
              total = rows[0].count;
            } else {
              if (rows[i].date !== rows[i - 1].date) {
                data.date.push(rows[i].date);
                data.total.push(total);
                total = rows[i].count;
              } else {
                total += rows[i].count;
              }
            }
            switch (rows[i].type) {
              case 'qq':
                data.qq.push(rows[i].count);
                break;
              case 'wy':
                data.wy.push(rows[i].count);
                break;
              case 'xm':
                data.xm.push(rows[i].count);
                break;
            }
          }
          data.total.push(total);
          return res.status(200).json(data);
        }
      })
    }
  });
});

router.post('/getTodayTop', function (req, res) {
    var timeLine = moment(moment().format('YYYY-MM-DD').toString() + " 12:00:10", "YYYY-MM-DD HH:mm:ss").format('X');
    var now = moment().format('X');
    var today = '';
    if (now - timeLine >= 0) {
      today = moment().format('YYYY-MM-DD').toString();
      console.log(today);
    } else {
      today = moment().subtract(1, 'days').format('YYYY-MM-DD').toString();
      console.log(today);
    }
    pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: error
        });
      } else {
        connection.query("select * from daily_top where date = '" + today + "' limit 10",
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
  }
);

router.post('/getTenDaysTop', function (req, res) {
    pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: error
        });
      } else {
        connection.query("select * from daily_top where rank = 1 order by id desc limit 10",
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
  }
);

module.exports = router;