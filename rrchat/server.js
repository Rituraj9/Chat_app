const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require("fs");
const PORT = process.env.PORT || 3000
const users = {};

app.set("view engine","ejs");
app.use(express.static("public"));

app.get('/',function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'});
	fs.readFile('./rrchat/index.html',null,function(error,data){
		if(error)
		{
			console.log(error);
		}
		else
		{
			res.write(data);
		}
		//res.end();
	});
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
    	console.log('New User', name);
    	users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
    	socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message => {
    	socket.broadcast.emit('leave',users[socket.id]);
    	delete users[socket.id];
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})