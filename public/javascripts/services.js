// Angular service module for connecting to JSON APIs
var hamboxServices = angular.module('hamboxServices', ['ngResource']);

hamboxServices.factory('WirelessConfig', function($resource) {
    return $resource('wirelessconfigs', {}, {
        // Use this method for getting a list of wireless configurations
        query: { method: 'GET', params: {}, isArray: true }
    })
});

hamboxServices.factory('socket', function($rootScope) {
    var socket = io.connect();
  
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
