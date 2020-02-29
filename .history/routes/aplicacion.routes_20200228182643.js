const express = require('express');
var router = express.Router();
var ws = require('../controllers/ws');// Web-sockets

const appCtrl = require('../controllers/aplicacion');
const Session = require('./Auth');

router.get('/', Session.isAuthenticaded, appCtrl.index);

router.post('/api/ruta/wirte', appCtrl.loriot);

module.exports = router;