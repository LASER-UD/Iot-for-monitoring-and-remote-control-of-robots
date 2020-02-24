//Este archivo se guarda las rutas 
var express = require("express"); //cost {Router} = requiere('express');
var router = express.Router();
const favicon = require('express-favicon');
router.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));

router.get('/', function(req, res, next) {
    res.render('login.hbs');
});

module.exports = router;