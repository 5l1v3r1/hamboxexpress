var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;
var WirelessState = mdb.WirelessState;
var spawn = require('child_process').spawn;
//var exec = require('child_process').exec;


exports.websockethandler = function(socket) {

    //==============================================================================================
    socket.on('updateiface', function(data) {
        var cmd = spawn("sudo", ["serverscripts/ibssiface.sh", 
            "/etc/network", 
            data.iface, 
            data.essid, 
            data.freq, 
            data.bw, 
            data.bssid, 
            data.iploc, 
            data.iplocmask, 
            data.txpower
        ]);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            console.log(outbuff);
            socket.emit('updateiface', 'done');
        });
    });

    //==============================================================================================
    socket.on('recycleiface', function(rowdata) {
        if (process.env.HAMBOXSIMU) {
            console.log('recycleiface');
            WirelessState.findOne({'iface': rowdata.iface}, function(err, data) {
                if (err) {
                    console.log(err);
                } else if (data) {
                    data.ipaddr = rowdata.ipaddr;
                    data.ipmask = rowdata.ipmask;
                    data.essid = rowdata.essid;
                    data.bssid = rowdata.bssid;
                    data.freq = rowdata.freq;
                    data.bw = rowdata.bw;
                    data.txpower = rowdata.mbm;
                    data.save(function(err){
                        if (err) {
                            console.log('update state error: ' + err.message);
                        } else {
                            console.log(data.iface + ' state updated');
                        }
                    });
                } else {
                    wirelessStateObject = {
                        iface: rowdata.iface,
                        ipaddr: rowdata.ipaddr,
                        ipmask: rowdata.ipmask,
                        essid: rowdata.essid,
                        bssid: rowdata.bssid,
                        freq: rowdata.freq,
                        bw: rowdata.bw,
                        txpower: rowdata.mbm
                    };
                    var wirelessState = new WirelessState(wirelessStateObject);
                    wirelessState.save(function(err, new_data) {
                        if (err) {
                            console.log('create state error: ' + err.message);
                        } else {
                            console.log(new_data.iface + " state created");
                        }
                    });
                }
            });
        } else {
            var cmd = spawn("serverscripts/go/bin/recycleiface", ["-interface", rowdata.iface]);
            var outbuff = '';
            cmd.stdout.on('data', function(data) {
                outbuff += data;
            });
            cmd.stdout.on('end', function() {
                console.log(outbuff);
                socket.emit('recycleiface', 'done');
            });
        }
    });

    //==============================================================================================
    socket.on('hnaroutes', function(data) {
        var cmd = spawn("serverscripts/go/bin/hnaroutes", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('hnaroutes', outbuff);
        });
    });
    
    //==============================================================================================
    socket.on('hostnames', function(data) {
        var cmd = spawn("serverscripts/go/bin/hostnames", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('hostnames', outbuff);
        });
    });
    
    //==============================================================================================
    socket.on('getmeshtopology:latlon', function(data) {
        var cmd = spawn("serverscripts/go/bin/latlongraph", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('getmeshtopology:latlon', outbuff);
        });
    });
    
    //==============================================================================================
    socket.on('getmeshtopology:dot', function(data) {
        var cmd = spawn("serverscripts/go/bin/dotgraph", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('getmeshtopology:dot', outbuff);
        });
    });
    
    //==============================================================================================
    socket.on('iwdevphyinfo', function(data) {
        var cmd = spawn("serverscripts/go/bin/wphycap", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('iwdevphyinfo', outbuff);
        });
    });
    
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


