var dgram = require('dgram');
var uuid = require('uuid');
var protocol = require('./protocol')
var clientudp = dgram.createSocket('udp4');

function Musician(instrument) {
    this.instrument = instrument;

    var data = {
        uuid: uuid(),
        instrument: instrument
    }

    Musician.prototype.update = function () {
        data.activeSince = new Date().toISOString();
        var payload = JSON.stringify(data,null,'\t');

        message = new Buffer(payload);
        clientudp.send(message, 0, message.length, protocol.UDP_PORT, protocol.MULTICAST_ADRESS, function (err, bytes) {
            console.log("Sending payload via port " + clientudp.address().port + "\n" + payload);
        });
    }
    setInterval(this.update.bind(this),protocol.TIME_PERIOD);
}

var instrument = process.argv[2];

var musician = new Musician(instrument);