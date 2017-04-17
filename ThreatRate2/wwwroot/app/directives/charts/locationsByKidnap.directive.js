(function () {
    'use strict';


    angular.module('tr').directive('chartLocationsByKidnap',
    [
        'common', 'config', 'chartsHelper',
        function (common, config, chartsHelper) {

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
                            name: 'locations.' + (chartData.name === 'other' ? 'common' : chartData.name),
                            scale: 1.45,
                            color: ChartsManager.defaults.darkColor
                        };

                    }
                        var options = {
                            bars: {
//                                height: 400,
                                width: 58,
                                maxValue: _.max(_.map(data, function (el) { return el.value; })) * 1.23, // to have space for the top icon and title
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
                                height: 100,
                                title: {
                                    height: 30,
                                    color: ChartsManager.defaults.darkColor
                                },
                                icon: {
                                    scale: 1.4,
                                    dy: -5
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