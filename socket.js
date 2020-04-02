const socketIO = require('socket.io');

var clients = [];

const connect = (server) => {
  io = socketIO(server);
  io.on('connection', (socketClient) => {
        socketClient.emit('connected', 'welcome');
    
    socketClient.on('authenticate',(info)=>{
        console.log(`${info.name} is Connected`);
        clients.push({
            name:info.name,
            id:socketClient.id,
        })
        socketClient.broadcast.emit({
            type:'connect',
            message: info.name
        })
        console.log(clients)        
    })

    socketClient.on('message',(data)=>{
        console.log(`${data}`);
        let i = clients.map(function(e) { return e.name; }).indexOf(data.to);
        if(i!=-1){
            socketClient.to(`${clients[i].id}`).emit(data);
        }else{
            console.log('[Error] message')
        }
    })
    
    socketClient.on('disconnect', ()=>{
        let i = clients.map(function(e) { return e.id; }).indexOf(socketClient.id);
        console.log(`${clients[i].name} is Disconnect`);
        socketClient.broadcast.emit({
            type:'disconnect',
            message: clients[i].name
        })
        clients.splice( i, 1 );//delete client to array
        console.log(clients)
    });
  });
};

module.exports = {
  connect,
};