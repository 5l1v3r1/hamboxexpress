// Angular module, defining routes for the app
var hamboxApp = angular.module('hamboxapp', [
    'ngRoute', 
    'ngGrid', 
    'highcharts-ng',
    'hamboxNetStatusControllers', 
    'hamboxMeshStatusControllers', 
    'hamboxNetConfigControllers', 
    'hamboxServices'
]);

hamboxApp.config(['$routeProvider', 
    function($routeProvider) {
        $routeProvider.
            when('/config/network', { 
                templateUrl: 'partials/config/network.html', 
                controller: 'NetConfigsCtrl'
            }).
            when('/status/network', { 
                templateUrl: 'partials/status/network.html', 
                controller: 'NetStatusCtrl'
            }).
            when('/status/mesh', { 
                templateUrl: 'partials/status/mesh.html', 
                controller: 'MeshStatusCtrl'
            }).
            // If invalid route, just redirect to the main list view
            otherwise({ 
                redirectTo: '/config/network' 
            });
    }
]);

