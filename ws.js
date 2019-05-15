var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8000 })
webSockets = new WebSocketServer({ noServer: true });//Objeto vacio
//webSockets={};
conexiones = [1, 1];//

var des;

wss.on('connection', function (ws, req) {
	user = req.url;
	switch (user) {
		case '/mecanico':
			if (conexiones[1] == 1) {
				webSockets[1] = ws;
				conexiones[1] = 0;
				console.log('mecanico conectado');
				if (conexiones[2] == 0) {//Jordan esta presente
					webSockets[2].send(JSON.stringify({'userFrom': 'Rita', 'type': 'MC' }));
				}
			} else {
				ws.send('usuario ya conectado');
				ws.close();
			}
			break;
		case '/jordan':
			webSockets[2] = ws;
			console.log('Jordan Conectado');
			if (conexiones[1] == 0) {//El mecanico esta presente
				webSockets[1].send(JSON.stringify({ 'userFrom': 'Rita', 'type': 'JC' }));
			}
			break;
		default:
			console.log('usuario sin identificacion');
			break;
	}
	ws.on('message', function (message) {
		var text_data_json = JSON.parse(message);
		if (text_data_json['userTo'] != 'Rita') {
			var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message'],'type':text_data_json['type']});
			try {
				console.log(parseInt(text_data_json['userTo']));
				webSockets[parseInt(text_data_json['userTo'])].send(request);
			}
			catch (error) {
				console.error("El error de siempre");
			}
		} else {
			console.log('Usuario '+ws.url+' de '+text_data_json['message']);
		}
	});
	ws.on('close', function () {
		var user = req.url;
		switch (user) {
			case '/mecanico':
				delete webSockets[1]
				conexiones[1] = 1;
				console.log('mecanico desconectado');
				if (conexiones[2] == 0) {//El mecanico esta presente
					webSockets[2].send(JSON.stringify({ 'userFrom': 'Rita', 'message': 'MD' }));
				}
				break;
			case '/jordan':
				delete webSockets[2]
				conexiones[2] = 1;//habilita el puerto
				console.log('Jordan desconectado');
				if(conexiones[1]==0){//El mecanico esta presente
					webSockets[1].send(JSON.stringify({ 'userFrom': 'Rita', 'type':'JD'}));
				}
				break;
			default:
				console.log('usuario sin identificacion');
				break;
		}
	}
	);
})
