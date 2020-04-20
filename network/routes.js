const user = require('../components/users/network')
const main = require('../components/main/network')

const routes = (server) =>{
    server.use('/user',user)
    server.use('/',main)//rutas normales
}

module.exports = routes