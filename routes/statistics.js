var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../config/musicbdConfig');
var pool = mysql.createPool(dbConfig.mysql);

router.post('/languageMap', function (req, res, next) {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      connection.query("SELECT * FROM qq_lang_count ORDER BY count DESC",
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

router.post('/getGenreByLanguage', function (req, res, next) {
  console.log(req.body);
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      var language = req.body.language;

      connection.query("select genre,count(id) from qq_lang where language = '" + language + "' group by genre",
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

router.post('/getMusicStoryGenre', function (req, res) {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      var sql = 'SELECT * FROM metadata_count ORDER BY count DESC;';
      connection.query(sql,
        function (error, rows) {
          if (error) {
            console.log(error);
            return res.status(500).json({
              error: error
            });
          } else {
            connection.release();
            var genres = [];
            var values = [];
            rows.forEach(function (row) {
              genres.push(row.genre);
              values.push(row.count);
            });
            return res.status(200).json({genres: genres, values: values});
          }
        }
      );
    }
  })
});

router.post('/getQQGenre', function (req, res) {
  pool.getConnection(function (error, connection) {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: error
      });
    } else {
      var sql = 'SELECT * FROM qq_genre;';
      connection.query(sql,
        function (error, rows) {
          if (error) {
            console.log(error);
            return res.status(500).json({
              error: error
            });
          } else {
            connection.release();
            var genres = [];
            var data = [];
            rows.forEach(function (row) {
              genres.push(row.genre);
              data.push({value: row.count, name: row.genre});
            });
            return res.status(200).json({genres: genres, data: data});
          }
        }
      );
    }
  })
});

module.exports = router;