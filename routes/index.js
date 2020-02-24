var express = require('express');
var router = express.Router();
const path = require('path');
const favicon = require('express-favicon');
router.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
var ws = require('../ws');


router.get('/mecanico', function (req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

router.get('/', function (req, res) {
  //res.sendFile(__dirname + '/ws.html');
  //res.sendFile(path.join(__dirname, '../public', 'index.html'));
  res.render('index.hbs');
})


/* GET home page. */
router.get('/asdf', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;