const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require("fs");
const PORT = process.env.PORT || 3000

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
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})