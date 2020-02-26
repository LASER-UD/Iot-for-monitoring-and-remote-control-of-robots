const express = require('express');
var router = express.Router();
var ws = require('../ws');// Web-sockets

const appCtrl = require('../controllers/aplicacion');
const Session = require('./Auth');

router.get('/', Session.isAuthenticaded, appCtrl.index);


module.exports = router;