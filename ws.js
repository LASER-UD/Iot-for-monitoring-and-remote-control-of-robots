var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 8000})
webSockets = new WebSocketServer({noServer: true});//Objeto vacio
var cont=0;
var des;
var UserID;
wss.on('connection', function (ws,req) {
cont=cont+1;
user=req.url();
switch(user){
	case 'mecanico':
		websockets[1]=ws;
		print('mecanico');
		break;
	case 'ras':
		websockets[2]=ws;
		break;
	default:
		print('usuario sin identificacion')
	break;
}
ws.on('message', function (message) {

    var text_data_json = JSON.parse(message);
    if(text_data_json['userTo']!='Rita'){
      var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message'],'type':text_data_json['type']});
      try {
        webSockets[text_data_json['userTo'].charCodeAt(1)].send(request);
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
  //delete ws;
  cont=cont-1;
  console.log('Usuario Desconectado ' + des);
})
// setInterval(
//   () => ws.send(`${new Date()}`),
//   1000
// )
});
