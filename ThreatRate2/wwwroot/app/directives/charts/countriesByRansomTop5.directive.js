(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByRansomTop5',
    [
        'common', 'config', 'chartsHelper', 'colorsService',
        function (common, config, chartsHelper, colorsService) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                scope.formatRansom = function (value) {
                    if (value > 100000) {
                        return (Math.round(value / 100000) / 10) + 'M';
                    } else if (value > 1000) {
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

                    data = _.sortBy(data, 'ransom').slice(data.length - 5).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var maxValue = _.max(_.map(data, function (el) { return el.ransom; }));

                    _.each(data, function (d, i) {
                        d.valueTitle = '$' + scope.formatRansom(d.ransom);
                        d.value = d.ransom;

                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        d.color = color,
                        d.icon = {
                            name: 'countries.' + d.name,
                            color: d.color,
                            scale: { width: 50, height: 50 }
                        };
                        var barDelay = 100;
                        var options = {
                                meta: {
                                    startDelay: barDelay * i  
                                },
                                layout: {
                                    rows: {
                                        count: 4
                                    }
                                },
                                bars: {
                                    fullFill: true,
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