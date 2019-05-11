var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 8000})
webSockets = new WebSocketServer({noServer: true});//Objeto vacio
var cont=0;

wss.on('connection', function (ws,req) {
cont=cont+1;
ws.on('message', function (message) {

    var text_data_json = JSON.parse(message);
    if(text_data_json['userTo']!='Rita'){
      var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message']});
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
      }
    }
});
ws.on('close', function () {
  delete webSockets[userID]
  cont=cont-1;
  console.log('Usuario Desconectado ' + userID);
})
// setInterval(
//   () => ws.send(`${new Date()}`),
//   1000
// )
});