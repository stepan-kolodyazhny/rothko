exports.writeJSON = function(io, fs) {
    const substrate = require('./public/model/substrate.json');
    const defaultJSON = require('./public/model/backup.json');

    io.on("connection", function (socket) {
        console.log("Made socket connection");

        socket.on('updatejson', (json) => {
            jsonUpdate(json)     
        });

        socket.on('jsontodefault', () => {
            jsonToDefault(defaultJSON);     
        });

    });

    function jsonUpdate(newJSON) {
    var json = JSON.stringify(newJSON)
    console.log(json)
    fs.writeFile('./public/model/substrate.json', json, err => {
        if (err) {
        console.log('Error writing file', err)
        } else {
        console.log('JSON successfully updated')
        }
    });
    }

    function jsonToDefault(defaultJSON) {
        var json = JSON.stringify(defaultJSON);
        fs.writeFile('./public/model/substrate.json', json, err => {
            if (err) {
            console.log('Error writing file', err)
            } else {
            console.log('JSON successfully returned to default')
            }
        });
    }
}

