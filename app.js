const express = require('express');
const fs = require('fs');
const path = require('path')
const https = require('https');
const socket = require('socket.io'); 

var app = express();
const opt = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

app.use(express.static(__dirname + '/public'));
var httpsServer = https.createServer(opt, app);
const server = httpsServer.listen(8080, () => { 
    console.log('hi');
});  

const io = socket(server);
const substrate = require('./updateSubstrate.js');

substrate.writeJSON(io, fs);

