// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
  	
}

var plNum = 0;
var first = 0;

// WEBSOCKET PORTION

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
	
		console.log("We have a new client: " + socket.id);
        plNum++;
        if(plNum == 2){
            socket.emit('start', 2);
            socket.broadcast.emit('start', 1);
            plNum = 0;
        }
		
		///MY SOCKET EVENTS HERE
    
        socket.on('swing', function(data){
            console.log("Swing registered: " + data);
            socket.broadcast.emit('swung', data);
        });
    
        socket.on('throw', function(){
            console.log("Throw registered");
            socket.broadcast.emit('thrown');
            socket.emit('thrown');
        });


		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);