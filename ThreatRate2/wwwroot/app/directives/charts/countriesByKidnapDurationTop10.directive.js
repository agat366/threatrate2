(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapDurationTop10',
    [
        'common', 'config', 'chartsHelper', 'colorsService',
        function (common, config, chartsHelper, colorsService) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                scope.formatRansom = function(value) {
                    if (value > 100000) {
                        return (Math.round(value / 100000) / 10) + 'M';
                    } else if(value > 1000) {
                        return Math.round(value / 100) / 10 + 'K';
                    } else {
                        return value;
                    }
                };

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    var top = angular.copy(scope.comparer);

                    var sorted = _.sortBy(data, 'duration').reverse();
                    data = sorted;

                    var durationContainer = element.find('[chart-body="duration"]');
                    durationContainer.html('');
                    var graphContainer = element.find('[chart-body="graphs"]');
                    graphContainer.html('');
                    var comparerContainer = element.find('[chart-body="comparer"]');
                    comparerContainer.html('');

                    var allDurations = _.map(data, function (el) { return el.duration; });
                    allDurations.push(scope.comparer.duration);

                    var maxDurationValue = _.max(allDurations);

                    var dataPrepared = _.map(data,
                        function (d, i) {
                            var color = colorsService.getColor(colorsService.schemas.levels4, d.duration, maxDurationValue);

                            var result = {
                                ransom: d.ransom,
                                value: d.duration,
                                valueTitle: 'days',
                                color: color //,
                                //                        d.icon = {
                                //                            name: 'countries.' + d.name,
                                //                            scale: { width: 40, height: 40 }
                                //                        };

                            }

                            return result;
                        });
                    var dataPreparedTop = _.map([top],
                        function (d, i) {
                            var color = /*d.duration === 0
                                ? colorsService.getColor(colorsService.schemas.empty)
                                : */colorsService.getColor(colorsService.schemas.levels4, d.duration, maxDurationValue);

                            var result = {
                                name: d.name,
                                title: d.title,
                                ransom: d.ransom,
                                value: d.duration,
                                valueTitle: 'days',
                                color: color //,
                                //                        d.icon = {
                                //                            name: 'countries.' + d.name,
                                //                            scale: { width: 40, height: 40 }
                                //                        };

                            }

                            return result;
                        });
                    scope.top = top;
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

                    var options = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                maxValue: maxDurationValue,
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

                        var optionsTop = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                maxValue: maxDurationValue,
                                margin: {
                                    left: 10,
                                    right: 10
                                },
                                title: {
                                    dy: -25
                                },
                                title2: {
                                    dy: -55
                                },
                                legend: {
                                    isVisible: false
                                }
                            }
                        };
                        var ch = new chartHourglass({
                            data: dataPreparedTop,
                            container: comparerContainer[0],
                            options: optionsTop
                    });

                    // levels
                        var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                        var options = {
                            bars: {
                                maxValue: maxValue,
                                maxValueRangeMultiplier: 1,
                                title: {
                                    height: 0
                                },
                                legend: {
                                    height: 130,
                                    dy: -15
                                },
                                legend2: {
                                    dy: 0
                                },
                                graph: {
                                    color: ChartsManager.defaults.frontColor
                                },
                                width: 56,
                                margin: {
//                                    left: 25
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
                                var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                                var result = {
                                    value: d.value,
                                    valueTitle: null,
                                    legendTitle2: d.value,
                                    color: color,
                                    title: d.title,
                                    icon: {
                                        name: 'countries.' + d.name,
                                        scale: { width: 40, height: 40 },
                                        position: 0,
                                        dy: -35,
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
                    data: '=',
                    comparer: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByKidnapDurationTop10.html'
            };

            return directive;
        }
    ]);
}());