var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: process.env.PORT_WEBSOCKET || 3000 })
webSockets = new WebSocketServer({ noServer: true });//Objeto vacio
connections = [1, 1, 1];
clients = []


wss.on('connection',(ws,req)=>{
	const socketClient=req.url.replace('/','')
	let i = clients.map((e) => { return e.name; }).indexOf(socketClient);
	if(i<0){
		clients.push({
			name:socketClient,
			id:ws,
		});
		console.log(`${socketClient} is Connected`);
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
			  client.send(JSON.stringify({
				  'type':'connected',
				  'message':socketClient
			}));
			}
		});
	}else{
		ws.send('usuario ya conectado');
		ws.close();
	}

	ws.on('message',(data) => {
		console.log(`${data}`);
        let i = clients.map((e) => { return e.name; }).indexOf(data.to);
        if(i!=-1){
			socketClient.to(`${clients[i].id}`).emit(data);
			clients[i].id.send(JSON.stringify(data));
        }else{
            console.log('[Error] message')
        }
	})

	ws.on('close', () => {
		const socketClient=req.url.replace('/','')
		let i = clients.map((e) => { return e.name; }).indexOf(socketClient);
        console.log(`${clients[i].name} is Disconnect`);
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
			  client.send(JSON.stringify({
				  'type':'disconnected',
				  'message':socketClient
			}));
			}
		});
		clients.splice(i,1);//delete client to array
	});
})