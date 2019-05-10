var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 8000})
webSockets = {}
var cont=0;

wss.on('connection', function (ws,req) {
//var userID = parseInt(req.url.substr(1)); //req.url//Obtiene la Url que se esta conectando
cont=cont+1;
var userID = cont;
webSockets[userID] = ws;
console.log('Usuario ' + userID + ' de ' + Object.getOwnPropertyNames(webSockets));
ws.on('message', function (message) {
  var text_data_json = JSON.parse(message);
  var toUserWebSocket = webSockets[parseInt(text_data_json['userTo'])];
  var request = JSON.stringify({'userFrom':text_data_json['userFrom'],'message':text_data_json['message']});
  toUserWebSocket.send(request);
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