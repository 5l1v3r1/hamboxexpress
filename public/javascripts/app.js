// Angular module, defining routes for the app
var hamboxApp = angular.module('hamboxapp', ['ngRoute', 'ngGrid', 'hamboxControllers', 'hamboxServices']);

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
            // If invalid route, just redirect to the main list view
            otherwise({ 
                redirectTo: '/config/network' 
            });
    }
]);

