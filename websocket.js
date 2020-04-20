var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: process.env.PORT_WEBSOCKET || 3000 })
webSockets = new WebSocketServer({ noServer: true });
let clients = []

const sendMessage = (message) =>{
        let i = clients.map((e) => { return e.name; }).indexOf(message.to);
        if(i!=-1){
                try{
                        clients[i].id.send(JSON.stringify(message));
                        return true;
                }catch(error){
                        console.log(`[Error] in send message to ${message.to}, Message ${error} `)
                        return false;
                }
        }else{
                console.log(`[Warning] User ${message.to} no is connected`)
                return false;
        }
}

const addConnection = (socketClient,ws)=>{
        clients.push({
                name:socketClient,
                id:ws,
        });
        console.log(`${socketClient} is Connected`);
}

const removeConnection = (name) => {
        let i = clients.map((e) => { return e.name; }).indexOf(name);
        console.log(`${name} is Disconnect`);
        clients.splice(i,1);//delete client to array
}

wss.on('connection',(ws,req)=>{
        const socketClient=req.url.replace('/','')
        let i = clients.map((e) => { return e.name; }).indexOf(socketClient);
        if(i<0){
                switch(socketClient){
                        case 'controller':
                                addConnection(socketClient,ws)
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
                                        message:'botVideo'
                                })}
                                break;
                        case 'botControl':
                                addConnection(socketClient,ws)
                                sendMessage({
                                        type:'connect',
                                        to:'controller',
                                        message:'botControl'
                                })
                                break;
                        case 'botVideo':
                                addConnection(socketClient,ws)
                                if(sendMessage({
                                        type:'connect',
                                        to:'controller',
                                        message:'botVideo'
                                })){
                                sendMessage({
                                        type:'connect',
                                        to:'botVideo',
                                        message:'controller'
                                })}
                                break;
                        break;
                        default:
                                ws.send('User Incorrect');
                                ws.close();
                        break;
                }
        }else{
                ws.send('User is already active');
                ws.close();
        }

        ws.on('message',(message) => {
                data = JSON.parse(message);
                sendMessage(data)
        })

        ws.on('close', () => {
                const socketClient=req.url.replace('/','')
                removeConnection(socketClient)
                switch(socketClient){
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
})
