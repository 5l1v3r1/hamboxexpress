var hamboxControllers = angular.module('hamboxNetStatusControllers', ['ui.bootstrap']);

//==================================================================================================
// Controller for the network status
//==================================================================================================

function NetStatusCtrl($scope, $rootScope, $interval, socket) {

    $scope.wirelessInterfacesList = [];
    $scope.selectedWirelessInterface = "select";
    $scope.macAndIp = "00:00:00:00:00:00";
    $scope.wirelessInterfacesList = [];
    $scope.hostnames = {};
    $scope.macaddresses = [];

    $scope.init = function() {
        $rootScope.refreshPromise = undefined;
        $scope.reStartRefresh();        
        socket.emit('wirelessifacelist', {});
        socket.emit('hostnames', {});
    }
    
    $scope.setSelectedWirelessInterface = function(iface) {
        $scope.selectedWirelessInterface = iface;
        $scope.reStartRefresh();
    }
    
    $scope.getWirelessInterfacesList = function() {
        $scope.selectedWirelessInterface = "select";
        socket.emit('wirelessifacelist', {});        
    }
    
    $rootScope.watchedMacAddress = "00:00:00:00:00:00";
        
    $scope.refreshRates = [
        {id: '0', name: '0.5s', value: 500},
        {id: '1', name: '1s', value: 1000},
        {id: '2', name: '2s', value: 2000},
        {id: '3', name: '3s', value: 3000},
        {id: '5', name: '5s', value: 5000}
    ];    
    
    $scope.selectedRate = $scope.refreshRates[2];
    
    $scope.setRefreshRate = function(rate) {
        $scope.selectedRate = rate;
        $scope.reStartRefresh();
    }
    
    $scope.refreshRateSubmit = function() {
        //$scope.reStartRefresh();
    }

    $scope.reStartRefresh = function() {
        if ($rootScope.refreshPromise != undefined) {
            $interval.cancel($rootScope.refreshPromise);
        }
        $rootScope.refreshPromise = $interval(getStationsDump, $scope.selectedRate.value);
    }
    
    $scope.neighborsListConfig = {  
        options: {
            chart: {
                type: 'bar',
                spacingBottom: 5,
                spacingTop: 15,
                spacingLeft: 5,
                spacingRight: 10,
                // Explicitly tell the width and height of a chart
                width: null,
                height: 470
            },
            title: {
                text: 'Received power'
            },
            subtitle: {
                text: 'dBm'
            },
            xAxis: {
                categories: ['00:00:00:00:00:00'],
                title: {
                    text: null
                }                    
            },
            yAxis: {
                min: -100,
                max: -20,
                title: {
                    text: 'dBm',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' dBm'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                $scope.setWatchedMacAddress(this.x);
                            }
                        }
                    }
                },
                series: {threshold: -100}
            },  
            legend: {
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
                x: -150,
                y: -5,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            }
        },                  
        series: [{
            name: 'Avg',
            data: [-60],
            dataLabels: {color: 'red'},
            color: '#FF6666'
        }, {
            name: 'Now',
            data: [-60],
            dataLabels: {color: 'grey'},
            color: 'grey'
        }]                                                           
    }
    
    $scope.setWatchedMacAddress = function(categoryindex) {
        $rootScope.watchedMacAddress = $scope.macaddresses[categoryindex];
        //$rootScope.watchedMacAddress = category.split("<")[0];
    }
    
    $scope.neighborWatchConfig = {
        options: {
            chart: {
                type: 'gauge',
                plotBorderWidth: 1,
                plotBackgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF4C6'],
                        //[0, '#EAEAEA'],
                        [0.3, '#FFFFFF'],
                        [1, '#FFF4C6']
                        //[1, '#EAEAEA']
                    ]
                },
                plotBackgroundImage: null,
                height: 280
            },            
            title: {
                text: 'Received power'
            },
            pane: [{
                startAngle: -70,
                endAngle: 70,
                background: null,
                center: ['50%', '108%'],
                size: 380
            }],    
            yAxis: [{
                min: -100,
                max: -20,
                tickInterval: 10,
                minorTickInterval: 1,
                minorTickLength: 5,
                minorTickPosition: 'outside',
                tickPosition: 'outside',
                labels: {
                    rotation: 'auto',
                    distance: 20,
                    step: 1
                },
                plotBands: [{
                    from: -100,
                    to: -90,
                    color: '#FF8080',
                    innerRadius: '100%',
                    outerRadius: '97%'
                },
                {
                    from: -90,
                    to: -60,
                    color: '#FFC266',
                    innerRadius: '100%',
                    outerRadius: '97%'
                },
                {
                    from: -60,
                    to: -20,
                    color: '#80FF80',
                    innerRadius: '100%',
                    outerRadius: '97%'
                }   
                          ],
                pane: 0,
                title: {
                    text: 'dBm',
                    y: -40
                }
            }],
            plotOptions: {
                gauge: {
                    dataLabels: {
                        enabled: true,
                        format: "{y: .0f}",
                        y: -40
                    },
                    dial: {
                        radius: '100%',
                        rearLength: "-30%"
                    }
                }
            },
            credits : {
                enabled: false
            }
        },
        series: [{
            data: [-60],
            yAxis: 0,
            dataLabels: {x: -15, backgroundColor: 'white'}
        }, {
            data: [-60],
            yAxis: 0,
            dataLabels: {x: 15, color: 'red', backgroundColor: 'white'},
            dial: {
                backgroundColor: 'red'
            }            
        }]             
    }
    
    $scope.neighborTxStatsConfig = {
        options: {
            chart: {
                type: 'bar',
                // Edit chart spacing
                spacingBottom: 15,
                spacingTop: 5,
                spacingLeft: 5,
                spacingRight: 5,
                // Explicitly tell the width and height of a chart
                width: 200,
                height: 160
            },
            title: {
                text: 'Tx packets',
                style: {"fontSize": "14px"},
                floating: true,
                align: 'left',
                x: 0,
                y: 15
            },
            subtitle: {
                text: '0',
                align: 'right'           
            },
            xAxis: {
                categories: [''],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                max: null,
                title: {
                    text: '%',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<span style="color:'+this.series.color+'">' + this.series.name + ' <b>' + Highcharts.numberFormat(this.y,2) + '%</b></span>';
                },
                useHTML: true
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        format: '{y:.2f}'
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'bottom',
                x: 0,
                y: 12,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            }
        },
        series: [{
            name: 'Failed',
            data: [0],
            dataLabels: {color: 'red'},
            color: '#FF6666'
        }, {
            name: 'Retried',
            data: [0],
            dataLabels: {color: 'grey'},
            color: 'grey'
        }]
    }

    $scope.neighborRatesConfig = {
        options: {
            chart: {
                type: 'bar',
                // Edit chart spacing
                spacingBottom: 15,
                spacingTop: 5,
                spacingLeft: 5,
                spacingRight: 5,
                // Explicitly tell the width and height of a chart
                width: 200,
                height: 160
            },
            title: {
                text: 'Throughput',
                style: {"fontSize": "14px"},
                floating: true,
                align: 'left',
                x: 0,
                y: 15
            },
            subtitle: {
                text: 'Mb/s',
                x: 10
            },
            xAxis: {
                categories: [''],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                max: null,
                title: {
                    text: 'Mb/s',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<span style="color:'+this.series.color+'">' + this.series.name + ' <b>' + Highcharts.numberFormat(this.y,2) + ' Mb/s</b></span>';
                },
                useHTML: true
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        format: '{y:.2f}'
                    }
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'left',
                verticalAlign: 'bottom',
                x: 0,
                y: 12,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            }
        },
        series: [{
            name: 'Tx',
            data: [0],
            dataLabels: {color: 'red'},
            color: '#FF6666'
        }, {
            name: 'Rx',
            data: [0],
            dataLabels: {color: 'grey'},
            color: 'grey'
        }]
    }

    socket.on('stationsdump:reply', function(jsondata) {
        if (($rootScope.refreshPromise != undefined) && (jsondata.length > 0)) {
            var neighborschart = $('#neighlist').highcharts();
            var neighborgaugechart = $('#neighwatch').highcharts();
            var neighbortxstatschart = $('#neightxstats').highcharts();
            var neighborrateschart = $('#neighrates').highcharts();
            $scope.macaddresses = [];
            var categories = [];
            var powernow = [];
            var poweravg = [];
            var stationdata = JSON.parse(jsondata);
            
            for (var macaddrkey in stationdata)
            {
                var ipaddress = stationdata[macaddrkey][7];
                var hostname = "";
                var categoryname = "";
                var neighbortitle = "";
                
                if (ipaddress.length > 0) {
                    categoryname = ipaddress;
                    if (ipaddress in $scope.hostnames) {
                        hostname = $scope.hostnames[ipaddress];
                        categoryname += '<br>' + hostname;
                        neighbortitle = hostname + ' - ' + ipaddress + ' - ';
                    } else {
                        neighbortitle = ipaddress + ' - ';
                    }
                } else {
                    categoryname = macaddrkey;
                }
                
                neighbortitle += macaddrkey;
                $scope.macaddresses.push(macaddrkey);
                categories.push(categoryname);
                powernow.push(stationdata[macaddrkey][3]);
                poweravg.push(stationdata[macaddrkey][4]);
                
                if ($rootScope.watchedMacAddress == macaddrkey) {
                    $scope.macAndIp = neighbortitle;
                    neighborgaugechart.series[0].points[0].update(stationdata[macaddrkey][3]);
                    neighborgaugechart.series[1].points[0].update(stationdata[macaddrkey][4]);
                    neighbortxstatschart.setTitle(null, {text: stationdata[macaddrkey][0]});
                    var retry_rate  = (stationdata[macaddrkey][1]/stationdata[macaddrkey][0])*100.0;
                    var failed_rate = (stationdata[macaddrkey][2]/stationdata[macaddrkey][0])*100.0;
                    neighbortxstatschart.series[0].points[0].update(failed_rate);
                    neighbortxstatschart.series[1].points[0].update(retry_rate);
                    var rx_rate = stationdata[macaddrkey][5];
                    var tx_rate = stationdata[macaddrkey][6];
                    if (tx_rate == 0.3) { tx_rate = 0.25; }
                    if (rx_rate == 0.3) { rx_rate = 0.25; }
                    neighborrateschart.series[0].points[0].update(rx_rate);
                    neighborrateschart.series[1].points[0].update(tx_rate);
                }
            }
            
            neighborschart.xAxis[0].setCategories(categories);
            neighborschart.series[0].setData(poweravg);
            neighborschart.series[1].setData(powernow);
        }
    });
    
    socket.on('wirelessifacelist', function(jsondata) {
        var ifacedata = JSON.parse(jsondata);
        
        for (var i in ifacedata) {
            $scope.wirelessInterfacesList.push(ifacedata[i]);
        }
    });
    
    socket.on('hostnames', function(jsondata) {
        var hostnames = JSON.parse(jsondata);
        $scope.hostnames = hostnames
    });
    
    var getStationsDump = function () {
        socket.emit('stationsdump:query', $scope.selectedWirelessInterface);
        //var currentdate = new Date();
        //console.log($scope.selectedRate.value + ">" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds());
    };  
    
    $scope.$on('$destroy', function(){
        if ($rootScope.refreshPromise != undefined) {
            $interval.cancel($rootScope.refreshPromise);
            $rootScope.refreshPromise = undefined;
        }
    });
}

