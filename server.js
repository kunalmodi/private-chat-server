var http = require('http');
var sys = require('util');
var nowjs = require('now');
var fs = require('fs');
var server = http.createServer(function (req,res){
    fs.readFile('./index.html', function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});
var everyone = nowjs.initialize(server);

var chatGroup = nowjs.getGroup("cool_kids");

nowjs.on('connect', function(){
  // Username & Password
  var valid = true;
  if (valid) {
		this.user.name = this.now.name;
		chatGroup.addUser(this.user.clientId);
		console.log("Joined: " + this.user.name);
	}
});

//nowjs.on('disconnect', function(){	
//  console.log("Left: " + this.now.name);
//});

chatGroup.on('join', function() {
	chatGroup.now.userJoin(this.user.name);
}
chatGroup.on('leave', function() {
	var self = this;
	chatGroup.now.userLeft(self.user.name);
}

chatGroup.now.distributeMessage = function(message) {
	// Store in Redis
	nowjs.getGroup(chatGroup).now.receiveMessage(this.user.name, message);
}

chatGroup.now.changePassword = function(oldPassword, newPassword) {
	// change password
});

/*everyone.now.distributeMessage = function(message){
	nowjs.getGroup(chatGroup).hasClient(this.user.clientId, function(bool) {
		if(bool) { // user is valid
		  nowjs.getGroup(chatGroup).now.receiveMessage(this.now.name, message);
		}
	});
};*/

server.listen(8080);
console.log("Listening on 8080");

