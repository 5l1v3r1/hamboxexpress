//==================================================================================================
// Directives for the mesh status
//==================================================================================================

hamboxApp.directive('visNetwork', function() {

    return {
        restrict: 'E',
        scope: {
            dot: "@",
            olsrlatlon: "@"
        },
        link: function(scope, element, attributes) {
            var options = {
                groups: {
                    self: {
                        fontColor: 'white',
                        color: {
                            border: '#AA0000',
                            background: '#FF6666'
                        }
                    }
                },
                edges: {
                    style: 'arrow',
                    fontSize: 12
                },
                nodes : {
                    shape: 'box',
                    fontColor: 'white',
                    fontFace: 'arial',
                    color: {
                        border: 'black',
                        background: 'grey'
                    }
                },
                width: '600px',
                height: '400px'
            };
            var datadot = {
                dot: "digraph topology{\"please wait...\"}"
            };
            var network = new vis.Network(element[0], datadot, options);

            attributes.$observe('dot', function(dotvalue) {
                var datadot = {
                    dot: dotvalue
                }
                network.setData(datadot);
            });
            
            attributes.$observe('olsrlatlon', function(latlonjs) {
                var nodes = [];
                var edges = [];
                interpretLatLonJS(latlonjs, nodes, edges);
                var data = {
                    nodes: nodes,
                    edges: edges
                };
                network.setData(data);
            });
        }
    };
    
    function interpretLatLonJS(latlonjs, nodes, edges) {
        function Self(ip, lat, lon, hna, route, name) {
            nodes.push({id: ip, label: name, title: name+'<br>'+ip, group: 'self'});
        }
        function Node(ip, lat, lon, hna, route, name) {
            nodes.push({id: ip, label: name, title: name+'<br>'+ip});
        }
        function Link(fromip, toip, lq, nlq, etx) {
            edges.push({from: fromip, to: toip, label: lq, title: lq+':'+nlq+':'+etx});
        }
        function PLink(fromip, toip, lq, nlq, etx, tolat, tolon, tohna, fromlat, fromlon, fromhna) {
            edges.push({from: fromip, to: toip, label: lq, title: lq+':'+nlq+':'+etx});
        }
        eval(latlonjs);
    }

});

hamboxApp.directive('openlayersMap', function() {
    return {
        restrict: 'E',
        scope: {
            olsrlatlon: "@"
        },
        link: function(scope, element, attributes) {
            var mapWidth = parseInt(attributes.width);
            var mapHeight = parseInt(attributes.height);
            var mapsize = new OpenLayers.Size(mapWidth, mapHeight);
            var map = new OpenLayers.Map(element[0], {size: mapsize});
            var osmLayer = new OpenLayers.Layer.OSM();
            var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
            map.addLayer(osmLayer);
            map.addLayer(vectorLayer);
            map.zoomToMaxExtent();
            
            attributes.$observe('olsrlatlon', function(latlonjs) {
                interpretLatLonJS(latlonjs, map, vectorLayer);
            });            
        }
    };
    
    function interpretLatLonJS(latlonjs, map, vectorLayer) {
        
        var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var selfStyle = {
            strokeColor: "#AA0000",
            strokeOpacity: 1,
            strokeWidth: "2",
            fillColor: "#FF6666",
            fillOpacity: 1,
            pointRadius: 4,
            graphicName: "circle"
        };
        var nodeStyle = {
            strokeColor: "black",
            strokeOpacity: 1,
            strokeWidth: "2",
            fillColor: "gray",
            fillOpacity: 1,
            pointRadius: 4,
            graphicName: "circle"
        };
        var markers = [];
        var pointsmap = {};
        var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {
            hover: true
        });
        
        function Self(ip, lat, lon, hna, route, name) {
            var position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
            var selfPoint = new OpenLayers.Geometry.Point(position.lon, position.lat);
            var selfAttr = {
                station_name: name,
                ip: ip,
                lat: lat,
                lon: lon
            };
            var selfMarker = new OpenLayers.Feature.Vector(selfPoint, selfAttr, selfStyle);
            markers.push(selfMarker);
            pointsmap[ip] = {point: selfPoint, self: 1};
            map.setCenter(position,12);
        }
        
        function Node(ip, lat, lon, hna, route, name) {
            var position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
            var nodePoint = new OpenLayers.Geometry.Point(position.lon, position.lat);
            var nodeAttr = {
                station_name: name,
                ip: ip,
                lat: lat,
                lon: lon
            };
            var nodeMarker = new OpenLayers.Feature.Vector(nodePoint, nodeAttr, nodeStyle);
            markers.push(nodeMarker);
            pointsmap[ip] = {point: nodePoint, self: 0};
        }
        
        function Link(fromip, toip, lq, nlq, etx) {
        }
        
        function PLink(fromip, toip, lq, nlq, etx, tolat, tolon, tohna, fromlat, fromlon, fromhna) {
        }
        
        function onFeatureHighlighted(evt) {
            // Needed only for interaction, not for the display.
            var onPopupClose = function (evt) {
                // 'this' is the popup.
                var feature = this.feature;
                if (feature.layer) {
                    selectControl.unselect(feature);
                }  
                this.destroy();
            }
            feature = evt.feature;
            popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100,100),
                    "<strong>"+feature.attributes.station_name + "</strong><br>" +
                    "IP: " + feature.attributes.ip + '<br>' +
                    "Pos: " + feature.attributes.lat + "," + feature.attributes.lon,
                null, true, onPopupClose
            );
            feature.popup = popup;
            popup.feature = feature;
            map.addPopup(popup, true);
        }
                
        eval(latlonjs);
        
        vectorLayer.addFeatures(markers);
        map.addControl(selectControl);
        selectControl.activate();
        selectControl.events.register('featurehighlighted', null, onFeatureHighlighted);
    }
});
