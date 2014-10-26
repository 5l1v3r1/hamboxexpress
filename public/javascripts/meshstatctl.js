var hamboxControllers = angular.module('hamboxMeshStatusControllers', ['ui.bootstrap']);

//==================================================================================================
// Controller for the mesh status
//==================================================================================================

function MeshStatusCtrl($scope, $rootScope, $interval, socket) {

    //==================================================================
    $scope.centerIP = "test";
    //$scope.test = {fromname: 'test1', toname: 'test2', lq: 1, nlq: 1, etx: 1, distance: 10.2, bearing: 306.9};
    $scope.hnadict = {};
    $scope.routesdict = {};
    $scope.meshtabledata = [];
    $scope.routetabledata =[];
    
    //==================================================================
    $scope.init = function() {
        socket.emit('hnaroutes');
    }

    //==================================================================
    socket.on('getmeshtopology:dot', function(dotdata) {
        $scope.meshtopologydot = dotdata;
    });
    
    //==================================================================
    socket.on('hnaroutes', function(jsondata) {
        var data = JSON.parse(jsondata);
        $scope.hnadict = data["hna"];
        $scope.routesdict = data["routes"];
        socket.emit('getmeshtopology:latlon', {}); // ensure proper chaining: hnaroutes then latlon
    });
    
    //==================================================================
    socket.on('getmeshtopology:latlon', function(latlonjs) {
        $scope.meshtopologylatlon = latlonjs;
    });
    
    //==================================================================
    $scope.refreshMeshTopology = function() {
        socket.emit('hnaroutes');
    }

    //==================================================================
    $scope.testApply = function() {
        console.log('test apply');
    }
    
    //==================================================================
    $scope.meshLinksGridOptions = { data: "meshtabledata",
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        rowTemplate: '<div style="height: 100%" ng-class="{ selected: row.selected}">' +
                         '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell">' +
                            '<div ng-cell></div>' +
                         '</div>' +
                     '</div>',
        columnDefs: [
            {field:'fromname', displayName:'From', enableCellEdit: false, width: 160},
            {field:'toname', displayName:'To', enableCellEdit: false, width: 160},
            {field:'distance', displayName:'D(km)', enableCellEdit: false, width: 60},
            {field:'bearing', displayName:'To(deg)', enableCellEdit: false, width: 60},
            {field:'lq', displayName:'LQ', enableCellEdit: false, width: 60},
            {field:'nlq', displayName:'NLQ', enableCellEdit: false, width: 60},
            {field:'etx', displayName:'ETX', enableCellEdit: false, width: 60}
        ]
    };
    
    //==================================================================
    $scope.resetMeshLinksTableRowSelection = function() {
        for (r in $scope.meshtabledata) {
            $scope.meshLinksGridOptions.selectRow(r, false);
        }
    }
    
    //==================================================================
    $scope.selectMeshLinksTableRow = function(fromip, toip) {
        for (r in $scope.meshtabledata) {
            if (($scope.meshtabledata[r].fromip == fromip) && ($scope.meshtabledata[r].toip == toip)) {
                $scope.meshLinksGridOptions.selectRow(r, true);
            }
        }
    }    

    //==================================================================
    $scope.meshRoutesGridOptions = { data: "routetabledata",
        enableCellSelection: false,
        enableRowSelection: true,
        enableCellEdit: false,
        enableColumnResize: true,
        showFilter: true,
        rowTemplate: '<div style="height: 100%" ng-class="{ selected: row.selected}">' +
                         '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell">' +
                            '<div ng-cell></div>' +
                         '</div>' +
                     '</div>',
        columnDefs: [
            {field:'name', displayName:'Node', enableCellEdit: false, width: 160},
            {field:'gw', displayName:'Gateway', enableCellEdit: false, width: 160},
            {field:'metric', displayName:'Metric', enableCellEdit: false, width: 60},
            {field:'etx', displayName:'ETX', enableCellEdit: false, width: 60},
            {field:'iface', displayName:'Iface', enableCellEdit: false, width: 80}
        ]
    };
    
    //==================================================================
    $scope.resetMeshRoutesTableRowSelection = function() {
        for (r in $scope.routetabledata) {
            $scope.meshRoutesGridOptions.selectRow(r, false);
        }
    }
    
    //==================================================================
    $scope.selectMeshRoutesTableRow = function(ip) {
        for (r in $scope.routetabledata) {
            if ($scope.routetabledata[r].ip == ip) {
                $scope.meshRoutesGridOptions.selectRow(r, true);
            }
        }
    }    
}

