var mdb = require('./mdb.js');
var WirelessConfig = mdb.WirelessConfig;
var WirelessState = mdb.WirelessState;
var WiredState = mdb.WiredState;
var spawn = require('child_process').spawn;


exports.websockethandler = function(socket) {

    //==============================================================================================
    socket.on('updatewirelessiface:ibss', function(data) {
        var ifacepath = "/etc/network";
        if (process.env.HAMBOXSIMU) {
            ifacepath = "serverscripts/go/simuroot" + ifacepath;
        }
        var cmd = spawn("sudo", ["serverscripts/ibssiface.sh", 
            ifacepath,
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
            socket.emit('updatewirelessiface', 'done');
        });
    });

    //==============================================================================================
    socket.on('updatewirediface', function(data) {
        var ifacepath = "/etc/network";
        if (process.env.HAMBOXSIMU) {
            ifacepath = "serverscripts/go/simuroot" + ifacepath;
        }
        var cmdargs = [
            "serverscripts/wirediface.sh", 
            ifacepath,
            data.iface, 
            data.addr, 
            data.mask, 
            data.mode
        ];
        var cmd = spawn("sudo", cmdargs);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            console.log(outbuff);
            socket.emit('updatewirediface', 'done');
        });
    });

    //==============================================================================================
    socket.on('recycleiface', function(rowdata) {
        if (process.env.HAMBOXSIMU) {
            console.log('recycleiface ' + rowdata.ifaceclass);
            var macaddr = {
                "eth0": "be:ef:de:ad:fe:01",
                "eth1": "be:ef:de:ad:fe:02",
                "eth2": "be:ef:de:ad:fe:03",
                "wlan0": "be:ef:de:ad:ff:01",
                "wlan1": "be:ef:de:ad:ff:02",
                "wlan2": "be:ef:de:ad:ff:03"
            }
            if (rowdata.ifaceclass == 'wireless') {
                WirelessState.findOne({'iface': rowdata.iface}, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else if (data) {
                        data.ipaddr = rowdata.ipaddr;
                        data.ipmask = rowdata.ipmask;
                        data.macaddr = macaddr[rowdata.iface];
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
                            macaddr: macaddr[rowdata.iface],
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
            } else if (rowdata.ifaceclass == 'wired') {
                WiredState.findOne({'iface': rowdata.iface}, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else if (data) {
                        data.ipaddr = rowdata.addr;
                        data.ipmask = rowdata.mask;
                        data.macaddr = macaddr[rowdata.iface];
                        data.save(function(err){
                            if (err) {
                                console.log('update state error: ' + err.message);
                            } else {
                                console.log(data.iface + ' state updated');
                            }
                        });
                    } else {
                        wiredStateObject = {
                            iface: rowdata.iface,
                            ipaddr: rowdata.addr,
                            ipmask: rowdata.mask,
                            macaddr: macaddr[rowdata.iface]
                        };
                        var wiredState = new WiredState(wiredStateObject);
                        wiredState.save(function(err, new_data) {
                            if (err) {
                                console.log('create state error: ' + err.message);
                            } else {
                                console.log(new_data.iface + " state created");
                            }
                        });
                    }
                });
            }
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
        if (process.env.HAMBOXSIMU) {
            console.log('ifacestate ' + data);
            var iwdict = {};
            var ipdict = {};
            var ifacestatedict = {};
            var ifaceseq = 0;
            WirelessState.find({}, function(err, data) {
                if (err) {
                    console.log(err);
                } else if (data) {
                    for (var i in data) {
                        var iwlist = [parseInt(i), data[i].macaddr, "IBSS", data[i].essid, 0, data[i].freq, data[i].bw, data[i].txpower];
                        var iplist = [ifaceseq, "UP", "ether", data[i].macaddr, data[i].ipaddr, data[i].ipmask];
                        iwdict[data[i].iface] = iwlist;
                        ipdict[data[i].iface] = iplist;
                        ifaceseq++;
                    }
                }
                ifacestatedict["iw"] = iwdict;
            });
            WiredState.find({}, function(err, data) {
                if (err) {
                    console.log(err);
                } else if (data) {
                    for (var i in data) {
                        var iplist = [ifaceseq, "UP", "ether", data[i].macaddr, data[i].ipaddr, data[i].ipmask];
                        ipdict[data[i].iface] = iplist;
                        ifaceseq++;
                    }
                }
                ifacestatedict["ip"] = ipdict;
                var json = JSON.stringify(ifacestatedict);
                socket.emit('ifacestate', json);
            });
        } else {
            var cmd = spawn("serverscripts/go/bin/netstatus", []);
            var outbuff = '';
            cmd.stdout.on('data', function(data) {
                outbuff += data;
            });
            cmd.stdout.on('end', function() {
                socket.emit('ifacestate', outbuff);
            });
        }
    });
    
    //==============================================================================================
    socket.on('currentconfig:wired', function(data) {
        var cmd = spawn("serverscripts/go/bin/lanconfig", []);
        var outbuff = '';
        cmd.stdout.on('data', function(data) {
            outbuff += data;
        });
        cmd.stdout.on('end', function() {
            socket.emit('currentconfig:wired', outbuff);
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
    
    //==============================================================================================
    socket.on('updatewiredconfig', function(data) {
        console.log("update:" + data._id + ":" + data.name);
        WiredConfig.findByIdAndUpdate(data._id, { $set: {
                name: data.name,
                iface: data.iface,
                ipaddr: data.ipaddr,
                ipmask: data.ipmask,
                type: data.type
            }}, function(err, changed_data) {
                if (err) throw 'Error';
                console.log(changed_data.name + " updated");
            }
        );
    });

    //==============================================================================================
    socket.on('addwiredconfig', function(data) {
        console.log("create:" + data._id + ":" + data.name);
        wiredConfigObject = {
            name: data.name,
            iface: data.iface,
            ipaddr: data.ipaddr,
            ipmask: data.ipmask,
            type: data.type
        };
        var wiredConfig = new WiredConfig(wirelessConfigObject);
        wiredConfig.save(function(err, new_data) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(new_data.name + " created");
            }
        });
    });
    
    //==============================================================================================
    socket.on('delwiredconfig', function(data) {
        console.log("delete:" + data._id + ":" + data.name);
        WiredConfig.remove({_id: data._id}, function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(data.name + " deleted");
            }
        });
    });
    
    //==============================================================================================
    
};


