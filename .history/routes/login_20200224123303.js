//Este archivo se guarda las rutas 
var express = require("express"); //cost {Router} = requiere('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login.hbs');
});

module.exports = router;