var hamboxControllers = angular.module('hamboxMeshStatusControllers', ['ui.bootstrap']);

//==================================================================================================
// Controller for the mesh status
//==================================================================================================

function MeshStatusCtrl($scope, $rootScope, $interval, socket) {

    $scope.init = function() {
        socket.emit('getmeshtopology:latlon', {});
    }

    socket.on('getmeshtopology:dot', function(dotdata) {
        $scope.meshtopologydot = dotdata;
    });
    
    $scope.refreshMeshTopology = function() {
        socket.emit('getmeshtopology:dot', {});
    }

    socket.on('getmeshtopology:latlon', function(latlonjs) {
        $scope.meshtopologylatlon = latlonjs;
    });
    
    $scope.refreshMeshTopology = function() {
        socket.emit('getmeshtopology:latlon', {});
    }

}

