var hamboxControllers = angular.module('hamboxNetConfigControllers', []);


//==================================================================================================
// Controller for the network configs grid
//==================================================================================================

function NetConfigsCtrl($scope, WirelessConfig, InetState, CurrentConfig, socket) {

    //==================================================================
    $scope.wirelessAllInterfacesList = [];

    //==================================================================
    $scope.init = function() {
        $scope.refreshIfaceState();
        $scope.refreshCurrentWireless();
        socket.emit('iwdevphyinfo', {});
    }

    //==================================================================
    socket.on('recycleiface', function(data) {
        $scope.refreshIfaceState();
    });
    
    //==================================================================
    socket.on('updateiface', function(data) {
        $scope.refreshCurrentWireless();
    });
    
    //==================================================================
    socket.on('iwdevphyinfo', function(jsondata) {

        var data = JSON.parse(jsondata);
        $scope.iwdevfreqs = {};
        
        for (var ikey in data) {
            var freqlist = [];
            for (var iband in data[ikey]["bands"]) {
                freqlist = freqlist.concat(data[ikey]["bands"][iband]);
            }
            $scope.iwdevfreqs[ikey] = freqlist;
        }
    });

    //==================================================================
    socket.on('ifacestate', function(jsondata) {
        
        var data = JSON.parse(jsondata);
        var data_iw = data["iw"];
        var data_ip = data["ip"];
        $scope.wirelessifaces = [];
        $scope.wiredifaces = [];
        
        for (var iwkey in data_iw) {
            var ipdata = data_ip[iwkey];
            var iwdata = data_iw[iwkey];
            var macaddr = iwdata[1];
            var type = iwdata[2];
            var active = (ipdata[1] == "UP");
            var ipaddr = "";
            var ipmask = 0;
            var essid ="";
            var chan = 0;
            var freq = 0;
            var bw = 0;
            var mbm = 0;
            if (active)
            {
                ipaddr = ipdata[4];
                ipmask = ipdata[5];
                essid = iwdata[3];
                chan = iwdata[4];
                freq = iwdata[5];
                bw = iwdata[6];
                mbm = iwdata[7];
            }
            $scope.wirelessifaces.push({
                iface: iwkey,
                type: type,
                macaddr: macaddr,
                active: active,
                ipaddr: ipaddr,
                ipmask: ipmask,
                essid: essid,
                bssid: "82:CC:16:64:64:41",
                chan: chan,
                freq: freq,
                bw: bw,
                mbm: mbm
            });
            $scope.wirelessAllInterfacesList.push(iwkey);
        }
        
        for (var ipkey in data_ip)
        {
            if (data_ip[ipkey][2] == "ether")
            {
                if (!(ipkey in data_iw))
                {
                    var ipdata = data_ip[ipkey];
                    var active = (ipdata[1] == "UP");
                    var macaddr = ipdata[3];
                    var ipaddr = "";
                    var ipmask = 0;
                    if (active)
                    {
                        ipaddr = ipdata[4];
                        ipmask = ipdata[5];
                    }
                    $scope.wiredifaces.push({
                        iface: ipkey,
                        macaddr: macaddr,
                        active: active,
                        ipaddr: ipaddr,
                        ipmask: ipmask
                    });
                } 
                
            }
        }
    });
    
    //==================================================================
    socket.on('currentconfig:wireless', function(jsondata) {
        var data = JSON.parse(jsondata);
        $scope.wirelesscurrentconfig = [];
        for (var i in data)
        {
            var ifaceitem = data[i];
            if (ifaceitem["type"] == "ibss")
            {
                $scope.wirelesscurrentconfig.push(ifaceitem);
            }
        }
    });

    //==================================================================
    $scope.wirelessconfigs = WirelessConfig.query();

    //==================================================================
    $scope.wirelessIfaceStateGridOptions = { data: "wirelessifaces",
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            { field:'active', displayName: 'Active', enableCellEdit: false, width: 60,
                cellTemplate: '<input type="checkbox" disabled ng-model="row.entity.active">'
            },
            {field:'iface', displayName:'Iface', enableCellEdit: false, width: 60},
            {field:'macaddr', displayName:'MAC', enableCellEdit: false, width: 140},
            {field:'ipaddr', displayName:'IP', enableCellEdit: false, width: 120},
            {field:'ipmask', displayName:'Mask', enableCellEdit: false, width: 60},
            {field:'essid', displayName:'ESSID', enableCellEdit: false, width: 160},            
            {field:'freq', displayName:'F(MHz)', enableCellEdit: false, width: 80},
            {field:'bw', displayName:'BW(MHz)', enableCellEdit: false, width: 80},
            {field:'mbm', displayName:'P(mBm)', enableCellEdit: false, width: 80},
            { field:'', displayName: 'Store', enableCellEdit: false, width: 60,
                cellTemplate: '<button id="cfgStoreBtn" type="button"  ng-click="newWirelessConfigRowFromCurrent(\
                    row.entity)" ><span class="glyphicon glyphicon-download"></span></button>'
            }
        ]
    };
        
    //==================================================================
    $scope.wiredIfaceStateGridOptions = { data: "wiredifaces",
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            { field:'active', displayName: 'Active', enableCellEdit: false, width: 60,
                cellTemplate: '<input type="checkbox" disabled ng-model="row.entity.active">'
            },
            {field:'iface', displayName:'Iface', enableCellEdit: false, width: 60},
            {field:'macaddr', displayName:'MAC', enableCellEdit: false, width: 140},
            {field:'ipaddr', displayName:'IP', enableCellEdit: false, width: 120},
            {field:'ipmask', displayName:'Mask', enableCellEdit: false, width: 60}
        ]
    };
    
    //==================================================================
    $scope.wirelessCurrentConfigGridOptions = { data: "wirelesscurrentconfig",
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            {field:'iface', displayName:'Iface', enableCellEdit: false, width: 60},
            {field:'ipaddr', displayName:'IP', enableCellEdit: false, width: 120},
            {field:'ipmask', displayName:'Mask', enableCellEdit: false, width: 60},
            {field:'essid', displayName:'ESSID', enableCellEdit: false, width: 160},
            {field:'bssid', displayName:'BSSID', enableCellEdit: false, width: 140},
            {field:'freq', displayName:'F(MHz)', enableCellEdit: false, width: 80},
            {field:'bw', displayName:'BW(MHz)', enableCellEdit: false, width: 80},
            {field:'mbm', displayName:'P(mBm)', enableCellEdit: false, width: 80},
            { field:'', displayName: 'Store', enableCellEdit: false, width: 60,
                cellTemplate: '<button id="cfgStoreBtn" type="button"  ng-click="newWirelessConfigRowFromCurrent(\
                    row.entity)" ><span class="glyphicon glyphicon-download"></span></button>'
            },            
            { field:'', displayName: 'Run', enableCellEdit: false, width: 60,
                cellTemplate: '<button id="cfgRunBtn" type="button"  ng-click="runCurrentWirelessConfig(\
                    row.entity)" ><span class="glyphicon glyphicon-play"></span></button>'
            },            
            { field:'', displayName: 'Delete', enableCellEdit: false, width: 60,
                cellTemplate: '<button id="cfgDelBtn" type="button"  ng-click="delCurrentWirelessConfig(\
                    row.entity)" ><span class="glyphicon glyphicon-remove"></span></button>'
            }            
        ]
    };
    
    //==================================================================
    $scope.newWirelessConfigRowFromCurrent = function(data) {
        $scope.wirelessconfigs.push({
            _id: -1,
            name: 'new', 
            iface: data.iface,
            iploc: data.ipaddr,
            iplocmask: data.ipmask,
            ipnet: '',
            ipnetmask: 8,
            essid: data.essid,
            bssid: data.bssid,
            freq: data.freq,
            bw: data.bw,
            txpower: data.mbm
        });
    }

    //==================================================================
    $scope.runCurrentWirelessConfig = function(data) {
        socket.emit('recycleiface', data);
    }
    
    //==================================================================
    $scope.delCurrentWirelessConfig = function(data) {
        alert("TODO");
    }
    
    //==================================================================
    $scope.availableBandwidths = [5, 10, 20];

    //==================================================================
    $scope.availableFrequencies = function(iface) {
        return $scope.iwdevfreqs[iface];
    }

    //==================================================================
    $scope.wirelessConfigGridOptions = { data: "wirelessconfigs",
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            {field:'name', displayName: 'Name', enableCellEdit: true, width: 140},
            {field:'iface',
                displayName:'Iface',
                enableCellEdit: true,
                width: 70,
                cellTemplate: '<div align="center"><select ng-model="row.entity.iface" ng-options="iface for iface in wirelessAllInterfacesList"></select></div>'},
            {field:'iploc', displayName:'IP', enableCellEdit: true, width: 120},
            {field:'iplocmask', displayName:'Mask', enableCellEdit: true, width: 60},
            //{field:'ipnet', displayName:'HamNet IP', enableCellEdit: true},
            //{field:'ipnetmask', displayName:'NetM', enableCellEdit: true},
            {field:'essid', displayName:'ESSID', enableCellEdit: true, width: 160},
            {field:'bssid', displayName:'BSSID', enableCellEdit: true, width: 140},
            {field:'freq', 
                displayName:'F(MHz)', 
                enableCellEdit: true, 
                width: 80,
                cellTemplate: '<div align="center"><select ng-model="row.entity.freq" ng-options="freq for freq in availableFrequencies(row.entity.iface)"></select></div>'},
            //{field:'bw', displayName:'BW(MHz)', enableCellEdit: true, width: 80},
            {field:'bw',
                displayName:'BW(MHz)',
                enableCellEdit: true,
                width: 80,
                cellTemplate: '<div align="center"><select ng-model="row.entity.bw" ng-options="bw for bw in availableBandwidths"></select></div>'},
            {field:'txpower', displayName:'P(mBm)', enableCellEdit: true, width: 80},
            { field:'', 
                displayName: 'Save', 
                enableCellEdit: false, 
                width: 60,
                cellTemplate: '<button id="wcEditBtn" type="button"  ng-click="saveWirelessConfigItem(row)" ><span class="glyphicon glyphicon-save"></span></button>'
            },
            { field:'', 
                displayName: 'Use', 
                enableCellEdit: false, 
                width: 60,
                cellTemplate: '<button id="wcRunBtn" type="button"  ng-click="useWirelessConfigItem(row)" ><span class="glyphicon glyphicon-upload"></span></button>'
            },
            { field:'', 
                displayName: 'Delete', 
                enableCellEdit: false, 
                width: 60,
                cellTemplate: '<button id="wcDelBtn" type="button"  ng-click="delWirelessConfigItem(row)" ><span class="glyphicon glyphicon-remove"></span></button>'
            }
        ]
    };
    
    //==================================================================
    $scope.saveWirelessConfigItem = function(row) {
        if (row.entity._id == -1) {
            socket.emit('addwirelessconfig', row.entity);
        }
        else {
            socket.emit('updatewirelessconfig', row.entity);
        }
    }
    
    //==================================================================
    $scope.useWirelessConfigItem = function(row) {
        socket.emit('updateiface', row.entity);
    }
    
    //==================================================================
    $scope.delWirelessConfigItem = function(row) {
        if (row.entity._id == -1) {
            var index = this.row.rowIndex;
            $scope.wirelessConfigGridOptions.selectItem(index, false);
            $scope.wirelessconfigs.splice(index, 1);
        }
        else {
            socket.emit('delwirelessconfig', row.entity);
            $scope.wirelessconfigs = WirelessConfig.query();
        }
    }
    
    //==================================================================
    $scope.refreshWirelessConfig = function() {
        $scope.wirelessconfigs = WirelessConfig.query();
    }
    
    //==================================================================
    $scope.refreshIfaceState = function() {
        InetState.query();
    }

    //==================================================================
    $scope.refreshCurrentWireless= function() {
        CurrentConfig.wireless();
    }
    
    //==================================================================
    $scope.refreshCurrentWired= function() {
        CurrentConfig.wired();
    }   
     
    //==================================================================
    $scope.addWirelessConfigRow = function() {
        var iface_init = '';

        if ($scope.wirelessAllInterfacesList.length > 0) {
            iface_init = $scope.wirelessAllInterfacesList[0];
        }

        $scope.wirelessconfigs.push({
            _id: -1,
            name: 'new', 
            iface: iface_init,
            iploc: '10.0.0.1',
            iplocmask: 24,
            ipnet: '',
            ipnetmask: 8,
            essid: 'BroadbandHamnet-v2',
            bssid: '82:CC:16:64:64:41',
            freq: 2392,
            bw: 5,
            txpower: 300
        });
    }
}

