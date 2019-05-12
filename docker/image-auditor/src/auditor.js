var musicians = [];
var protocol = require('./protocol')
var moment = require('moment')

/* --------------------- TCP SERVER --------------------------------------------*/
var net = require('net');
var servertcp = net.createServer();

servertcp.on('connection', function (socket) {

    clearMusicians();
    socket.write(JSON.stringify(musicians,null,'\t') + "\n");
    socket.end();

});

function clearMusicians() {

    musicians.forEach(musician => {

        var i = musicians.indexOf(musician);

        // if the musician didn't play for a time, we remove it
        if(moment(new Date()).diff(musicians[i].activeSince) > protocol.TIME_NOT_PLAYING){
            console.log('This musician is leaving\n' + JSON.stringify(musicians[i],null,'\t'));
            musicians.splice(i, 1);
        }
    });
}

servertcp.listen(protocol.TCP_PORT);

/* --------------------- UDP SERVER --------------------------------------------*/

var dgram = require('dgram');
var serverudp = dgram.createSocket('udp4');

serverudp.on('message', function (msg, source) {

    var musician = JSON.parse(msg);
    addMusician(musician);

});

function addMusician(musician)
{
    for (var i = 0; i < musicians.length; i++) {
    
        // update the attribute activeSince if the musician is already present
        if (musician.uuid == musicians[i].uuid) {
            musicians[i].activeSince = musician.activeSince; 
            return;
        }
    }

    // add to the musicians if not present
    console.log("This musician is playing\n" + JSON.stringify(musician,null,'\t'));
    musicians.push(musician);
}

serverudp.bind(protocol.UDP_PORT, function () {

    console.log('An auditor is joining multicast group...\n');
    serverudp.addMembership(protocol.MULTICAST_ADRESS);

});
