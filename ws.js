var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 8000})
webSockets = new WebSocketServer({noServer: true});//Objeto vacio
websockets[1]='';
websockets[2]='';
var cont=0;
var des;

wss.on('connection', function (ws,req) {
cont=cont+1;
user=req.url;
switch(user){
	case '/mecanico':
		if(websockets[1]=''){
			websockets[1]=ws;
			console.log('/mecanico');
		}else{
			ws.send('usuario ya conectado');
			ws.close();		
		}
		break;
	case '/ras':
		if(websockets[1]=''){
			websockets[2]=ws;
			console.log('RAS');
		}else{
			ws.send('usuario ya conectado');
			ws.close();		
		}
		break;
	default:
		console.log('usuario sin identificacion');
	break;
}
ws.on('message', function (message) {

    var text_data_json = JSON.parse(message);
    if(text_data_json['userTo']!='Rita'){
      var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message'],'type':text_data_json['type']});
      try {
        webSockets[text_data_json['userTo']].send(request);
      }
      catch(error) {
        console.error("El error de siempre");
      }
    }else{
      if(text_data_json['message']=='conexion'){
          var userID = text_data_json['userFrom'].charCodeAt(1); //req.url//Obtiene la Url que se esta conectando
          webSockets[userID] = ws;
          console.log('Usuario ' + userID + ' de ' + Object.getOwnPropertyNames(webSockets));
      }else{
          console.log(text_data_json['message']);
          des=text_data_json['userFrom'];
      }
    }
});
ws.on('close', function () {
var user=req.url;
switch(user){
	case '/mecanico':
		websockets[1]='';
		console.log('desconectado mecanico');
		break;
	case '/ras':
		websockets[2]='';
		console.log('desconectado ras');
		break;
	default:
		console.log('usuario sin identificacion');
	break;
})
// setInterval(
//   () => ws.send(`${new Date()}`),
//   1000
// )
});
