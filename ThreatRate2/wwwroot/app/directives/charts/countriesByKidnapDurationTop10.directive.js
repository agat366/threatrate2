(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapDurationTop10',
    [
        'common', 'config', 'chartsHelper',
        function (common, config, chartsHelper) {

            var defaults = {
            };

            var colors = [
                '#6c1a12',
                '#8a281c',
                ChartsManager.defaults.frontColor,
                '#ee8879',
                '#ffcac2'
            ];

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    var sorted = _.sortBy(data, 'duration');
                    var top = sorted[sorted.length - 1];
                    data = sorted.slice(sorted.length - 11, 10).reverse();

                    var durationContainer = element.find('[chart-body="duration"]');
                    durationContainer.html('');
                    var graphContainer = element.find('[chart-body="graphs"]');
                    graphContainer.html('');
                    var comparerContainer = element.find('[chart-body="comparer"]');
                    comparerContainer.html('');


                    var dataPrepared = _.map(data,
                        function(d, i) {
                            var result = {
                                ransom: d.ransom,
                                value: d.duration,
                                valueTitle: 'days',
                                color: i < colors.length ? colors[i] : colors[colors.length - 1] //,
                                //                        d.icon = {
                                //                            name: 'countries.' + d.name,
                                //                            scale: { width: 40, height: 40 }
                                //                        };

                            }

                            return result;
                        });
                    var dataPreparedTop = _.map([top],
                        function(d, i) {
                            var result = {
                                name: d.name,
                                title: d.title,
                                ransom: d.ransom,
                                value: d.duration,
                                valueTitle: 'days',
                                color: i < colors.length ? colors[i] : colors[colors.length - 1] //,
                                //                        d.icon = {
                                //                            name: 'countries.' + d.name,
                                //                            scale: { width: 40, height: 40 }
                                //                        };

                            }

                            return result;
                        });
                    scope.top = dataPreparedTop[0];
                    scope.top.iconName = 'countries.' + scope.top.name;
                    scope.top.iconColor = ChartsManager.defaults.backColor;
                    scope.top.duration = top.duration;
                    scope.top.color = scope.top.color;

                    var icon = $('.comparer [chart-icon]');
                    icon.html('');
                    ChartsManager.renderImage(icon[0],
                        scope.top.iconName,
                        scope.top.iconColor,
                        -1, true);

                    scope.countries = dataPrepared;

                    var maxValue = _.max(_.map(data, function (el) { return el.duration; }));

                    var options = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                maxValue: maxValue,
                                margin: {
                                    left: 10,
                                    right: 10
                                },
                                title: {
                                    dy: -8
                                },
                                title2: {
                                    dy: -25
                                },
                                legend: {
                                    isVisible: false
                                }
                            }
                        };
                        var ch = new chartHourglass({
                            data: dataPrepared,
                            container: durationContainer[0],
                            options: options
                    });

                        var options = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                maxValue: maxValue,
                                margin: {
                                    left: 10,
                                    right: 10
                                },
                                title: {
                                    dy: -8
                                },
                                title2: {
                                    dy: -25
                                },
                                legend: {
                                    isVisible: false
                                }
                            }
                        };
                        var ch = new chartHourglass({
                            data: dataPreparedTop,
                            container: comparerContainer[0],
                            options: options
                    });

                    // levels
                        var maxValue2 = _.max(_.map(data, function (el) { return el.ransom; }));

                        var options = {
                            bars: {
                                maxValue: maxValue2,
                                maxValueRangeMultiplier: 1,
                                title: {
                                    height: 30
                                },
                                width: 90,
                                margin: {
                                    left: 25
                                }
                            },
                            layout: {
                                padding: {
                                    top: 20,
                                    left: 5,
                                    right: 5,
                                    bottom: 0
                                }
                            }
                        }
                        var graphPrepared = _.map(data,
                            function (d, i) {
                                var result = {
                                    value: d.ransom,
                                    color: i < colors.length ? colors[i] : colors[colors.length - 1],
                                    title: d.title,
                                    icon: {
                                        name: 'countries.' + d.name,
                                        scale: { width: 40, height: 40 },
                                        position: 0,
                                        dy: -20,
                                        dx: -15,
                                        toCenter: true

                                    }

                                }

                                return result;
                            });
                        var ch = new chartLevelsVertical({
                            data: graphPrepared,
                            container: graphContainer[0],
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByKidnapDurationTop10.html'
            };

            return directive;
        }
    ]);
}());