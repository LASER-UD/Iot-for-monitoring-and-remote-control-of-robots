import net from 'net'

const server = net.createServer(socket => {
  socket.on('data', data => {
  
    try { var r = JSON.parse(data);
         
    console.log(`Solicitud-${data.toString()}`)
    }

catch(data){ 
    console.log("Aceptado")

}
  })
})

server.on('connect', () => console.log('socket connected'))

server.listen(
  {
    host: '0.0.0.0',
    port: 8000,
    exclusive: true
  },
  () => console.log('Servidor socket abierto en ', server.address())
)
