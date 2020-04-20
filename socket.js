const socketIO = require('socket.io')

var clients = [];

const sendMessage = (message,socketClient) =>{
        //let i = clients.map((e) => { return e.name; }).indexOf(message.to);
        let i = clients.findIndex(objClient => message.to === objClient.name)
        if(i!=-1){
                try{
                        socketClient.to(`${clients[i].id}`).emit(message);
                        return true
                }catch(error){
                        console.log(`[Error] in send message to ${message.to}, Message ${error} `)
                        return false
                }
        }else{
                console.log(`[Warning] User ${message.to} no is connected`)
                return false
        }
}
const removeConnection = (id) => {
    //let i = clients.map((e) => { return e.name; }).indexOf(message.to);
    let i = clients.findIndex(objClient=> id === objClient.id)
    let nameOut = clients[i].name
    console.log(`${nameOut} is Disconnect`);
    clients.splice(i,1);//delete client to array
    return nameOut
}
const addConnection = (name,id)=>{
    clients.push({
            name:name,
            id:id,
    });
    console.log(`${name} is Connected`);
}

const connect = (server) => {
    io = socketIO(server)
    io.attach(process.env.PORT_WEBSOCKET||8000);
    console.log(`Server Websocket on port ${process.env.PORT_WEBSOCKET}`)

    io.on('connection', (socketClient) => {
            addConnection(socketClient.handshake.query.user,socketClient.id,socketClient)
            socketClient.emit('connected', 'welcome');
            switch(socketClient.handshake.query.user){
                case 'controller':
                        sendMessage({
                                type:'connect',
                                to:'botControl',
                                message:'controller'
                        })
                        if(sendMessage({
                                type:'connect',
                                to:'botVideo',
                                message:'controller'
                        })){
                            sendMessage({
                                type:'connect',
                                to:'controller',
                                message:'botControl'
                            })
                        }
                        break;
                case 'botControl':
                        if(sendMessage({
                                type:'connect',
                                to:'controller',
                                message:'botControl'
                        })){
                            sendMessage({
                                type:'connect',
                                to:'btnControl',
                                message:'controller'
                            })
                        }
                        break;
                case 'botVideo':
                        if(sendMessage({
                                type:'connect',
                                to:'controller',
                                message:'botVideo'
                        })){
                            sendMessage({
                                type:'connect',
                                to:'controller',
                                message:'controller'
                            })
                        }
                        break;
                break;
                default:
                        socketClient.emit("Invalid User")
                        socketClient.disconnect(true)
                break;
            }
            console.log(clients)

            socketClient.on('message',(data)=>{
                console.log(`${data}`);
                sendMessage(data)
            })

            socketClient.on('disconnect', ()=>{
                switch(removeConnection(socketClient.id)){
                    case 'controller':
                            sendMessage({
                                    type:'disconnect',
                                    to:'botControl',
                                    message:'controller'
                            })
                            sendMessage({
                                type:'disconnect',
                                to:'botVideo',
                                message:'controller'
                            })
                            break;
                    case 'botControl':
                            sendMessage({
                                    type:'disconnect',
                                    to:'controller',
                                    message:'botControl'
                            })
                    break;
                    default:
                            break;
                }
            });
    });
};

module.exports = {
  connect,
};