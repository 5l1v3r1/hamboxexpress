var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;
var spawn = require('child_process').spawn;
//var exec = require('child_process').exec;


exports.websockethandler = function(socket) {

    socket.on('cmd', function(cdata) {
        console.log('spawning ' + cdata.cmd + ' ' + cdata.parms);
        var cmd = spawn(cdata.cmd, cdata.parms);
        var outb = '';
        cmd.stdout.on('data', function(data) {
            outb += data;
        });
        cmd.stdout.on('end', function() {
            console.log('stdout:\n' + outb);
        });
        cmd.on('close', function (code) {
          console.log('child process exited with code ' + code);
        });        
    });

    socket.on('updatewirelessconfig', function(data) {
        console.log("update:" + data._id + ":" + data.name);
        WirelessConfig.findByIdAndUpdate(data._id, { $set: {
                name: data.name,
                iface: data.iface,
                iploc: data.iploc,
                iplocmask: data.iplocmask,
                ipnet: data.ipnet,
                iplocmask: data.iplocmask,
                essid: data.essid,
                bssid: data.bssid,
                freq: data.freq,
                bw: data.bw,
                txpower: data.txpower
            }}, function(err, changed_data) {
                if (err) throw 'Error';
                console.log(changed_data.name + " updated");
            }
        );
    });

    socket.on('addwirelessconfig', function(data) {
        console.log("create:" + data._id + ":" + data.name);
        wirelessConfigObject = {
            name: data.name,
            iface: data.iface,
            iploc: data.iploc,
            iplocmask: data.iplocmask,
            ipnet: data.ipnet,
            iplocmask: data.iplocmask,
            essid: data.essid,
            bssid: data.bssid,
            freq: data.freq,
            bw: data.bw,
            txpower: data.txpower
        };
        var wirelessConfig = new WirelessConfig(wirelessConfigObject);
        wirelessConfig.save(function(err, new_data) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(new_data.name + " created");
            }
        });
    });
    

    socket.on('delwirelessconfig', function(data) {
        console.log("delete:" + data._id + ":" + data.name);
        WirelessConfig.remove({_id: data._id}, function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(data.name + " deleted");
            }
        });
    });
};


