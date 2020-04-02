const express = require('express')
const user = require('../components/users/network')
const main = require('../components/main/network')
const ws = require('../websocket');// Web-sockets

const routes = (server) =>{
    server.use('/user',user)
    server.use('/',main)//rutas normales
}

module.exports = routes