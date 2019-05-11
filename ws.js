var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 8000})
webSockets = new WebSocketServer({noServer: true});//Objeto vacio
var cont=0;

wss.on('connection', function (ws,req) {
//var userID = parseInt(req.url.substr(1)); //req.url//Obtiene la Url que se esta conectando
cont=cont+1;
var userID = cont;
webSockets[userID] = ws;
console.log('Usuario ' + userID + ' de ' + Object.getOwnPropertyNames(webSockets));
ws.on('message', function (message) {
    var text_data_json = JSON.parse(message);
    if(text_data_json['userFrom']!='Rita'){
      var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message']});
      try {
        webSockets[parseInt(text_data_json['userTo'])].send(request);
      }
      catch(error) {
        console.error("El error de siempre");
      }
    }else{
      console.log(text_data_json['message']);
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