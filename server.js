var WebSocketServer = new require('ws');
// подключенные клиенты
var clients = {};
// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws) {
  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);
  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);
    for(var key in clients) {
      clients[key].send(message);
    }
  });
  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
});
// обычный сервер (статика) на порту 8080
const http = require("http");
const fs = require("fs");
http.createServer(function(request, response){
    console.log(`Запрошенный адрес: ${request.url}`);
    if(request.url.startsWith("/public/")){
        // получаем путь после слеша
        var filePath = request.url.substr(1);
        fs.readFile(filePath, function(error, data){
            if(error){
                response.statusCode = 404;
                response.end("Resourse not found!");
            }
            else{
                response.setHeader("Content-Type", "text/html");
                response.end(data);
            }
        })
    }
    else{
        // во всех остальных случаях отправляем строку hello world!
        response.end("Hello World!");
    }
}).listen(8080);
console.log("Сервер запущен на портах 8080, 8081");

