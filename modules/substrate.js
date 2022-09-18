exports.onRecord = function(io, fs, path) {
    const substrate = require('../public/model/substrate.json')

    io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on('event', (msg) => {
        if (msg.levels) {
        console.log(msg.levels[1])
        writeSync(msg)
        }
        
    });
    });

    function writeSync(msg) {
    var json = JSON.stringify(msg)
    fs.writeFile('../public/model/substrate.json', json, err => {
        if (err) {
        console.log('Error writing file', err)
        } else {
        console.log('Successfully wrote file')
        }
    });
    }
}

