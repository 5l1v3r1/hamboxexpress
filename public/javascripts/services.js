// Angular service module for connecting to JSON APIs
var hamboxServices = angular.module('hamboxServices', ['ngResource']);

hamboxServices.factory('InetState', function(socket) {
    return {
        query: function() {
            socket.emit('ifacestate', {});
        }
    }
});

hamboxServices.factory('CurrentConfig', function(socket) {
    return {
        wireless: function() {
            socket.emit('currentconfig:wireless', {});
        },
        wired: function() {
            socket.emit('currentconfig:wired', {});
        }   
    };
});

hamboxServices.factory('WirelessConfig', function($resource) {
    return $resource('wirelessconfigs', {}, {
        // Use this method for getting a list of wireless configurations
        query: { method: 'GET', params: {}, isArray: true }
    })
});

hamboxServices.factory('socket', function($rootScope) {
    var initialPage = window.location.pathname;
    var socketPath = '';

    if (initialPage != '/') {
        socketPath = initialPage;
    }

    var socket = io.connect('/', {resource: socketPath+'socket.io'}); //TODO: context sensitiveness for the hambox shit
  
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
