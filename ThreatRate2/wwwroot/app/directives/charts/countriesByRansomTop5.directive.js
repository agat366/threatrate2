﻿(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByRansomTop5',
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

                    data = _.sortBy(data, 'ransom').slice(data.length - 5).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var maxValue = _.max(_.map(data, function (el) { return el.ransom; }));

                    _.each(data, function (d, i) {
                        d.valueTitle = '$' + d.ransom + ' M';
                        d.value = d.ransom;
                        d.color = i < colors.length ? colors[i] : colors[0],
                        d.icon = {
                            name: 'countries.' + d.name,
                            color: d.color,
                            scale: { width: 50, height: 50 }
                        };

                        var options = {
                                layout: {
                                    rows: {
                                        count: 4
                                    }
                                },
                                bars: {
                                    maxValue: maxValue,
                                    margin: {
                                        left: 40,
                                        right: 40
                                    },
                                    title: {
                                        dy: -10
                                    },
                                    legend: {
                                        icon: {
                                            height: 70,
                                            dy: -20
                                        },

                                        height: 120,
                                        dy: -180
                                    }
                                }
                            };
                            var ch = new chartDollar({
                                data: [data[i]],
                                container: chartsContainer[i],
                                options: options
                            });
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByRansomTop5.html'
            };

            return directive;
        }
    ]);
}());