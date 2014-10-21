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
            network.on('select', onNetworkSelect);

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
            
            function onNetworkSelect(properties) {
                if (properties.nodes.length > 0) {
                    scope.$parent.centerIP = properties.nodes[0]; // update in controller
                } else {
                    scope.$parent.centerIP = "";
                }
                scope.$parent.$digest();
            }
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
            olsrlatlon: "@",
            centerip: "@"
        },
        link: function(scope, element, attributes) {

            var mapWidth = parseInt(attributes.width);
            var mapHeight = parseInt(attributes.height);
            var mapsize = new OpenLayers.Size(mapWidth, mapHeight);
            var map = new OpenLayers.Map(element[0], {size: mapsize});
            var osmLayer = new OpenLayers.Layer.OSM();
            var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
            var positionsmap = {};

            map.addLayer(osmLayer);
            map.addLayer(vectorLayer);
            map.zoomToMaxExtent();
            
            attributes.$observe('olsrlatlon', function(latlonjs) {
                interpretLatLonJS(latlonjs, map, vectorLayer, positionsmap, scope.$parent.meshtabledata);
            }); 
            
            attributes.$observe('centerip', function() {
                if (scope.$parent.centerIP.length > 0) {
                    if (scope.$parent.centerIP in positionsmap) {
                        map.setCenter(positionsmap[scope.$parent.centerIP]);
                    }
                }
            }); 
        }
    };
    
    function interpretLatLonJS(latlonjs, map, vectorLayer, positionsmap, tabledata) {
        
        var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
        var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var markers = [];
        var pointsmap = {};
        
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
        var linkStyle = {
            strokeColor: "#FF6666",
            strokeOpacity: 1,
            strokeWidth: "2"
        };
        var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {
            hover: true
        });
        
        function Self(ip, lat, lon, hna, route, name) {
            var position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
            var selfPoint = new OpenLayers.Geometry.Point(position.lon, position.lat);
            var selfAttr = {
                type: "node",
                station_name: name,
                ip: ip,
                lat: lat,
                lon: lon
            };
            var selfMarker = new OpenLayers.Feature.Vector(selfPoint, selfAttr, selfStyle);
            positionsmap[ip] = position;
            markers.push(selfMarker);
            pointsmap[ip] = {point: selfPoint, self: 1, name: name, lat: lat, lon: lon};
            map.setCenter(position,12);
        }
        
        function Node(ip, lat, lon, hna, route, name) {
            var position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
            var nodePoint = new OpenLayers.Geometry.Point(position.lon, position.lat);
            var nodeAttr = {
                type: "node",
                station_name: name,
                ip: ip,
                lat: lat,
                lon: lon
            };
            var nodeMarker = new OpenLayers.Feature.Vector(nodePoint, nodeAttr, nodeStyle);
            positionsmap[ip] = position;
            markers.push(nodeMarker);
            pointsmap[ip] = {point: nodePoint, self: 0, name: name, lat: lat, lon: lon};
        }
        
        function Link(fromip, toip, lq, nlq, etx) {
            var fromPoint = pointsmap[fromip];
            var toPoint = pointsmap[toip];
            var distance = f4exbloc.distance(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon);
            var bearingTo = f4exbloc.bearing(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon);
            var bearingFrom = f4exbloc.bearing(toPoint.lat, toPoint.lon, fromPoint.lat, fromPoint.lon);
            var linkAttr = {
                type: "link",
                from: fromPoint.name,
                to: toPoint.name,
                distance: distance,
                bearingTo: bearingTo,
                bearingFrom: bearingFrom
            };
            var linkLine = new OpenLayers.Geometry.LineString([fromPoint.point, toPoint.point]);
            var linkMarker = new OpenLayers.Feature.Vector(linkLine, linkAttr, linkStyle);
            var tablerow = {};
            markers.push(linkMarker);
            tablerow.fromname = linkAttr.from;
            tablerow.toname = linkAttr.to;
            tablerow.lq = lq;
            tablerow.nlq = nlq;
            tablerow.etx = etx;
            tablerow.distance = linkAttr.distance;
            tablerow.bearing = linkAttr.bearingTo;
            tabledata.push(tablerow);
        }
        
        function PLink(fromip, toip, lq, nlq, etx, tolat, tolon, tohna, fromlat, fromlon, fromhna) {
            var fromPoint = pointsmap[fromip];
            var toPoint = pointsmap[toip];
            var distance = f4exbloc.distance(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon);
            var bearingTo = f4exbloc.bearing(fromPoint.lat, fromPoint.lon, toPoint.lat, toPoint.lon);
            var bearingFrom = f4exbloc.bearing(toPoint.lat, toPoint.lon, fromPoint.lat, fromPoint.lon);
            var linkAttr = {
                type: "link",
                from: fromPoint.name,
                to: toPoint.name,
                distance: distance,
                bearingTo: bearingTo,
                bearingFrom: bearingFrom
            };
            var linkLine = new OpenLayers.Geometry.LineString([fromPoint.point, toPoint.point]);
            var linkMarker = new OpenLayers.Feature.Vector(linkLine, linkAttr, linkStyle);
            var tablerow = {};
            markers.push(linkMarker);
            tablerow.fromname = linkAttr.from;
            tablerow.toname = linkAttr.to;
            tablerow.lq = lq;
            tablerow.nlq = nlq;
            tablerow.etx = etx;
            tablerow.distance = linkAttr.distance.toFixed(3);
            tablerow.bearing = linkAttr.bearingTo.toFixed(1);
            tabledata.push(tablerow);
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
            var popupStr = "";
            if (feature.attributes.type == "node") {
                popupStr = "<strong>"+feature.attributes.station_name + "</strong><br>" +
                    "IP: " + feature.attributes.ip + '<br>' +
                    "Pos: " + feature.attributes.lat + "," + feature.attributes.lon;
            } else if (feature.attributes.type == "link") {
                popupStr = "<strong>" + feature.attributes.from + "&#10142;" + feature.attributes.to + "</strong><br>" +
                    feature.attributes.distance.toFixed(3) + "km &#8614;" + feature.attributes.bearingTo.toFixed(1) + " &#8612;" + feature.attributes.bearingFrom.toFixed(1); 
            }
            popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100,100),
                popupStr,
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
