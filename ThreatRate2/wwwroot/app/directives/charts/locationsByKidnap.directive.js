(function () {
    'use strict';


    angular.module('tr').directive('chartLocationsByKidnap',
    [
        'common', 'config', 'chartsHelper',
        'colorsService',
        function (common, config, chartsHelper, colors) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    scope.total = _.reduce(_.map(data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    for (var i = 0; i < data.length; i++) {
                        var chartData = data[i];
                        chartData.valueTitle = chartData.value;
                        chartData.icon = {
                            name: chartData.name === 'unknown' || !chartData.name ? 'signs.unknown' : 
                                ('locations.' + (chartData.name === 'other' ? 'common' : chartData.name)),
                            scale: { width: 40, height: 40 },
//                            position: 0,
                            toCenter: true,
                            dx: -20, dy: -20,
                            color: ChartsManager.defaults.darkColor
                        };

                    }

                    var barColor = colors.getColor(colors.schemas.veryHigh);
                    var options = {
                        bars: {
                            color: barColor,
//                                height: 400,
                            width: 58,
                            maxValue: _.max(_
                                    .map(data, function(el) { return el.value; })) *
                                1.23, // to have space for the top icon and title
                            title: {
                                dy: -10,
                                dx: 0
                            },
                            topIcon: {
                                dy: -50
                            },
                            margin: {
                                right: 16,
                                left: 16
                            }
                        },
                        legend: {
                            height: 135,
                            title: {
                                height: 50,
                                color: ChartsManager.defaults.darkColor
                            },
                            icon: {
                                scale: 1.4,
                                dy: -7
                            }
                        }
                    };

                    var ch = new chartSlicedBarVertical({
                        data: data,
                        container: chartsContainer[0],
                        options: options
                    });
                }
            }
            
            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/locationsByKidnap.html'
            };

            return directive;
        }
    ]);
}());