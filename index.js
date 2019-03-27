var express = require('express');
var path = require('path');
var app = express();

app.set('port', (process.env.PORT || 5000)); //this is necessary but I'm not sure why

app.use(express.static(__dirname));

app.get('/', function (req, res) { //serve the index.html file from this directory 
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(app.get('port'), function() { //this is necessary too
    console.log("Node app is running at localhost:" + app.get('port'))
});
