var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8000 })
webSockets = new WebSocketServer({ noServer: true });//Objeto vacio
//webSockets={};
conexiones = [1, 1, 1];//
//hola
var des;

wss.on('connection', function (ws, req) {
	user = req.url;
	switch (user) {
		case '/mecanico':
			if (conexiones[1] == 1) {
				webSockets[1] = ws;
				conexiones[1] = 0;
				console.log('Mecanico Conectado');
				if (conexiones[2] == 0) {//Jordan esta presente
					console.log('Jordan el mecanico se conecto');
					webSockets[1].send(JSON.stringify({'userFrom': 'Rita', 'type': 'JC' }));
					webSockets[2].send(JSON.stringify({'userFrom': 'Rita', 'type': 'MC' }));
    	    webSockets[3].send(JSON.stringify({'userFrom': 'Rita', 'type': 'MC' }));
				}
			} else {
				ws.send('usuario ya conectado');
				ws.close();
			}
			break;
		case '/jordan':
			webSockets[2] = ws;
			conexiones[2] = 0;
			console.log('Jordan Conectado');
			if (conexiones[1] == 0) {//El mecanico esta presente
				console.log('Mecanico jordan se conecto');
				webSockets[1].send(JSON.stringify({'userFrom': 'Rita', 'type': 'JC' }));
				webSockets[2].send(JSON.stringify({'userFrom': 'Rita', 'type': 'MC' }));
			}
			break;
   	case '/jordan1':
			webSockets[3] = ws;
			conexiones[3] = 0;
			console.log('Jordan1 Conectado');
			if (conexiones[1] == 0) {//El mecanico esta presente
				console.log('Mecanico jordan se conecto');
				//webSockets[1].send(JSON.stringify({'userFrom': 'Rita', 'type': 'JC' }));
				webSockets[3].send(JSON.stringify({'userFrom': 'Rita', 'type': 'MC' }));
			}
			break;
		default:
			console.log('usuario sin identificacion');
			break;
	}
	ws.on('message', function (message) {
		var text_data_json = JSON.parse(message);
		if (text_data_json['userTo'] != 'Rita') {
			try {
				var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message'],'type':text_data_json['type']});
				webSockets[parseInt(text_data_json['userTo'])].send(request);
				if(text_data_json['userTo']=='2'){
				console.log(text_data_json['message']);}
			}
			catch (error) {
				var request = JSON.stringify({'userFrom':'Rita','type': 'MD'});
				webSockets[parseInt(text_data_json['userFrom'])].send(request);
				console.log("Alguno de desconecto");
			}
		} else {
			console.log('Usuario '+text_data_json['userFrom']+' de '+text_data_json['message']);
		}
	});
	ws.on('close', function () {
		var user = req.url;
		switch (user) {
			case '/mecanico':
				delete webSockets[1]
				conexiones[1] = 1;
				console.log('mecanico desconectado');
				if (conexiones[2] == 0) {//Jordan esta presente
					console.log('Jordan mecanico Desconectado');
					webSockets[3].send(JSON.stringify({ 'userFrom': 'Rita', 'type': 'MD' }));
          webSockets[2].send(JSON.stringify({ 'userFrom': 'Rita', 'type': 'MD' }));
				}
				break;
			case '/jordan':
				delete webSockets[2]
				conexiones[2] = 1;//habilita el puerto
				console.log('Jordan desconectado');
				if(conexiones[1]==0){//El mecanico esta presente
					console.log('Mecanico jordan Desconectado');
					webSockets[1].send(JSON.stringify({ 'userFrom': 'Rita', 'type':'JD'}));
				}
				break;
      case '/jordan1':
				delete webSockets[3]
				conexiones[3] = 1;//habilita el puerto
				console.log('Jordan desconectado');
				if(conexiones[1]==0){//El mecanico esta presente
					console.log('Mecanico jordan Desconectado');
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