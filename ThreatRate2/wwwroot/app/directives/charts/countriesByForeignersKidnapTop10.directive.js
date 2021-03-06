﻿(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersKidnapTop10',
    [
        'common', 'config', 'chartsHelper', 'colorsService',
        function (common, config, chartsHelper, colorsService) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    data = _.sortBy(data, 'value').slice(data.length - 10).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var total = _.reduce(_.map(data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        d.valueTitle = d.value;
                        d.value2 = (Math.round(d.value / total * 1000) / 10) + '%';

                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        d.color = color,
                        d.icon = {
                            name: 'countries.' + d.name,
                            scale: { width: 50, height: 50 }
                            };
//                        d.titleColor = d.color;

                    }

                    var options = {
                            layout: {
                                rows: {
                                    count: 7
                                },
                                columns: {
                                    border: {
                                        width: .5
                                    }
                                },
                                padding: {
                                    top: 10
                                }
                            },
                            bars: {
                                pointMaskRadius: 90,
//                                maxValue: maxValue,
                                maxValueRangeMultiplier: 1.3,
                                icon: {
                                    name: 'signs.foreigner',
                                    height: 45,
                                    dx: 0,
                                    dy: 3,
                                    scale: 1.15
                                },
                                title: {
//                                    dy: 0
                                },
                                legend: {
                                    icon: {
                                        height: 80,
                                        dy: 30
                                    },

                                    height: 170
                                }
                            },
                            animation: {
                                barDelay: 20
                            }
                        };
                        var ch = new chartGridVertical({
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByForeignersKidnapTop10.html'
            };

            return directive;
        }
    ]);
}());