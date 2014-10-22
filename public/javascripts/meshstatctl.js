var hamboxControllers = angular.module('hamboxMeshStatusControllers', ['ui.bootstrap']);

//==================================================================================================
// Controller for the mesh status
//==================================================================================================

function MeshStatusCtrl($scope, $rootScope, $interval, socket) {

    //==================================================================
    $scope.centerIP = "test";
    //$scope.test = {fromname: 'test1', toname: 'test2', lq: 1, nlq: 1, etx: 1, distance: 10.2, bearing: 306.9};
    $scope.meshtabledata = [];
    
    //==================================================================
    $scope.init = function() {
        socket.emit('getmeshtopology:latlon', {});
    }

    //==================================================================
    socket.on('getmeshtopology:dot', function(dotdata) {
        $scope.meshtopologydot = dotdata;
    });
    
    //==================================================================
    $scope.refreshMeshTopology = function() {
        socket.emit('getmeshtopology:dot', {});
    }

    //==================================================================
    socket.on('getmeshtopology:latlon', function(latlonjs) {
        $scope.meshtopologylatlon = latlonjs;
    });
    
    //==================================================================
    $scope.refreshMeshTopology = function() {
        socket.emit('getmeshtopology:latlon', {});
    }

    //==================================================================
    $scope.testApply = function() {
        console.log('test apply');
    }
    
    //==================================================================
    $scope.meshStateGridOptions = { data: "meshtabledata",
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
            {field:'fromname', displayName:'From', enableCellEdit: false, width: 180},
            {field:'toname', displayName:'To', enableCellEdit: false, width: 180},
            {field:'lq', displayName:'LQ', enableCellEdit: false, width: 80},
            {field:'nlq', displayName:'NLQ', enableCellEdit: false, width: 80},
            {field:'etx', displayName:'ETX', enableCellEdit: false, width: 80},
            {field:'distance', displayName:'D(km)', enableCellEdit: false, width: 80},
            {field:'bearing', displayName:'To(deg)', enableCellEdit: false, width: 80}
        ]
    };
    
    //==================================================================
    $scope.resetMeshTableRowSelection = function() {
        for (r in $scope.meshtabledata) {
            $scope.meshStateGridOptions.selectRow(r, false);
        }
    }
    
    //==================================================================
    $scope.selectMeshTableRow = function(fromip, toip) {
        for (r in $scope.meshtabledata) {
            if (($scope.meshtabledata[r].fromip == fromip) && ($scope.meshtabledata[r].toip == toip)) {
                $scope.meshStateGridOptions.selectRow(r, true);
            }
        }
    }    
}

