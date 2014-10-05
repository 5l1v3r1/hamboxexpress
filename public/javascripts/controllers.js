var hamboxControllers = angular.module('hamboxControllers', []);

// Controller for the network configs grid
function NetConfigsCtrl($scope, WirelessConfig, InetState, socket) {

    socket.on('ifacestate', function(jsondata) {
        var data = JSON.parse(jsondata);
        var data_iw = data["iw"];
        var data_ip = data["ip"];
        $scope.wirelessifaces = [];
        $scope.wiredifaces = [];
        for (var iwkey in data_iw)
        {
            var ipdata = data_ip[iwkey];
            var iwdata = data_iw[iwkey];
            var macaddr = iwdata[1];
            var type = iwdata[2];
            var active = (ipdata[0] == "UP");
            var ipaddr = "";
            var ipmask = 0;
            var chan = 0;
            var freq = 0;
            var bw = 0;
            if (active)
            {
                ipaddr = ipdata[3];
                ipmask = ipdata[4];
                chan = iwdata[3];
                freq = iwdata[4];
                bw = iwdata[5];
            }
            $scope.wirelessifaces.push({
                iface: iwkey,
                type: type,
                macaddr: macaddr,
                active: active,
                ipaddr: ipaddr,
                ipmask: ipmask,
                chan: chan,
                freq: freq,
                bw: bw
            });
        }
        
        for (var ipkey in data_ip)
        {
            if (data_ip[ipkey][1] == "ether")
            {
                if (!(ipkey in data_iw))
                {
                    var ipdata = data_ip[ipkey];
                    var active = (ipdata[0] == "UP");
                    var macaddr = ipdata[2];
                    var ipaddr = "";
                    var ipmask = 0;
                    if (active)
                    {
                        ipaddr = ipdata[3];
                        ipmask = ipdata[4];
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
    
    $scope.wirelessconfigs = WirelessConfig.query();
    
    $scope.wirelessIfaceStateGridOptions = { data: "wirelessifaces",
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            { field:'active', displayName: 'Active', enableCellEdit: false, 
                cellTemplate: '<input type="checkbox" disabled ng-model="row.entity.active">'
            },
            {field:'iface', displayName:'Iface', enableCellEdit: false},
            {field:'macaddr', displayName:'MAC', enableCellEdit: false},
            {field:'ipaddr', displayName:'IP', enableCellEdit: false},
            {field:'ipmask', displayName:'Mask', enableCellEdit: false},
            {field:'freq', displayName:'F(MHz)', enableCellEdit: false},
            {field:'bw', displayName:'BW(MHz)', enableCellEdit: false}
        ]
    };
        
    $scope.wiredIfaceStateGridOptions = { data: "wiredifaces",
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            { field:'active', displayName: 'Active', enableCellEdit: false, 
                cellTemplate: '<input type="checkbox" disabled ng-model="row.entity.active">'
            },
            {field:'iface', displayName:'Iface', enableCellEdit: false},
            {field:'macaddr', displayName:'MAC', enableCellEdit: false},
            {field:'ipaddr', displayName:'IP', enableCellEdit: false},
            {field:'ipmask', displayName:'Mask', enableCellEdit: false}
        ]
    };
        
    $scope.wirelessConfigGridOptions = { data: "wirelessconfigs",
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enableColumnResize: true,
        showFilter: true,
        columnDefs: [
            {field:'name', displayName: 'Name', enableCellEdit: true},
            {field:'iface', displayName:'Iface', enableCellEdit: true}, 
            {field:'iploc', displayName:'HamLocal IP', enableCellEdit: true}, 
            {field:'iplocmask', displayName:'LocM', enableCellEdit: true},
            {field:'ipnet', displayName:'HamNet IP', enableCellEdit: true},
            {field:'ipnetmask', displayName:'NetM', enableCellEdit: true},
            {field:'essid', displayName:'ESSID', enableCellEdit: true},
            {field:'bssid', displayName:'BSSID', enableCellEdit: true},
            {field:'freq', displayName:'Freq', enableCellEdit: true},
            {field:'bw', displayName:'BW', enableCellEdit: true},
            {field:'txpower', displayName:'mBm', enableCellEdit: true},
            { field:'', displayName: 'Save', enableCellEdit: false, 
                cellTemplate: '<button id="editBtn" type="button"  ng-click="saveWirelessConfigItem(\
                    row)" ><span class="glyphicon glyphicon-save"></span></button>'
            },
            { field:'', displayName: 'Apply', enableCellEdit: false, 
                cellTemplate: '<button id="wcRunBtn" type="button"  ng-click="runWirelessConfigItem(\
                    row)" ><span class="glyphicon glyphicon-play"></span></button>'
            },
            { field:'', displayName: 'Delete', enableCellEdit: false, 
                cellTemplate: '<button id="wcRunBtn" type="button"  ng-click="delWirelessConfigItem(\
                    row)" ><span class="glyphicon glyphicon-remove"></span></button>'
            }
        ]
    };
    
    $scope.saveWirelessConfigItem = function(row) {
        if (row.entity._id == -1) {
            socket.emit('addwirelessconfig', row.entity);
        }
        else {
            socket.emit('updatewirelessconfig', row.entity);
        }
    }
    
    $scope.runWirelessConfigItem = function(row) {
        socket.emit('cmd', {cmd: "ls", parms: ["-lh","-a"]});
    }
    
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
    
    $scope.refreshWirelessConfig = function() {
        $scope.wirelessconfigs = WirelessConfig.query();
    }
    
    $scope.refreshIfaceState = function() {
        InetState.query();
    }
    
    $scope.addWirelessConfigRow = function() {
        $scope.wirelessconfigs.push({
            _id: -1,
            name: 'new', 
            iface: 'wlan0',
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
