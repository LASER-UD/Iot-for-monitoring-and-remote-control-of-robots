const socketIO = require('socket.io')

var clients = [];

const sendMessage = (message,socketClient) =>{
        //let i = clients.map((e) => { return e.name; }).indexOf(message.to);
        let i = clients.findIndex(objClient => message.to === objClient.name)
        if(i!=-1){
                try{
                        socketClient.to(clients[i].id).emit('message',message);
                }catch(error){
                        console.log(`[Error] in send message to ${message.to}, Message ${error} `)
                }
        }
}

const sendConnected = (message,socketClient) =>{
        let i = clients.findIndex(objClient => message.to === objClient.name)
        if(i!=-1){
                try{
                        socketClient.to(clients[i].id).emit('connected',message);
                        return true
                }catch(error){
                        console.log(`[Error] in send message to ${message.to}, Message ${error} `)
                        return false
                }
        }
        return false;
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
            const user = socketClient.handshake.query.user
            switch(user){
                case 'controller':
                        addConnection(user,socketClient.id)
                        sendConnected({to:'botVideo',message:'controller'},socketClient)
                        if(sendConnected({to:'botControl',message:'controller'},socketClient)){
                                socketClient.emit('connected', {message:'botControl'});
                        }
                        
                        break;
                case 'botControl':
                        addConnection(user,socketClient.id)
                        if(sendConnected({to:'controller',message:'botControl'},socketClient)){
                                socketClient.emit('connected', {message:'controller'});
                        }
                        break;
                case 'botVideo':
                        addConnection(user,socketClient.id)
                        if(sendConnected({to:'controller',message:'botVideo'},socketClient)){
                                socketClient.emit('connected', {message:'controller'});
                        }
                        break;
                break;
                default:
                        socketClient.emit("Invalid User")
                        socketClient.disconnect(true)
                break;
            }

            socketClient.on('message',(data)=>{
                sendMessage(data,socketClient)
            })

            socketClient.on('disconnect', ()=>{
                switch(removeConnection(socketClient.id)){
                    case 'controller':
                            sendMessage({
                                    type:'disconnect',
                                    to:'botControl',
                                    message:'controller'
                            },socketClient)
                            sendMessage({
                                type:'disconnect',
                                to:'botVideo',
                                message:'controller'
                            },socketClient)
                            break;
                    case 'botControl':
                            sendMessage({
                                type:'disconnect',
                                to:'controller',
                                message:'botControl'
                            },socketClient)
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