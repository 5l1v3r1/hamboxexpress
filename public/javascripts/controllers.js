var hamboxControllers = angular.module('hamboxControllers', []);

// Controller for the network configs grid
function NetConfigsCtrl($scope, WirelessConfig, socket) {
    $scope.wirelessconfigs = WirelessConfig.query();
    
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
