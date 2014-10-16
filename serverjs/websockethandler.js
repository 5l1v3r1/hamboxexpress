var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;
var spawn = require('child_process').spawn;
//var exec = require('child_process').exec;


exports.websockethandler = function(socket) {

    //==============================================================================================
    socket.on('ifacestate', function(data) {
        //var cmd = spawn("serverscripts/netstatus.py", []);
        var cmd = spawn("serverscripts/go/bin/netstatus", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('ifacestate', outbuff);
        });
    });
    
    //==============================================================================================
    socket.on('currentconfig:wireless', function(data) {
        //var cmd = spawn("serverscripts/lanconfig.py", ["-w"]);
        var cmd = spawn("serverscripts/go/bin/lanconfig", ["-wireless"]);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('currentconfig:wireless', outbuff);
        });
    });    

    //==============================================================================================
    socket.on('stationsdump:query', function(iface) {
        var cmd = spawn("serverscripts/go/bin/stations", ["-interface", iface]);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('stationsdump:reply', outbuff);
        });
    });

    //==============================================================================================
    socket.on('wirelessifacelist', function(data) {
        var cmd = spawn("serverscripts/go/bin/wdevlist", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('wirelessifacelist', outbuff);
        });
    });
    
    //==============================================================================================
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

    //==============================================================================================
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
    
    //==============================================================================================
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


