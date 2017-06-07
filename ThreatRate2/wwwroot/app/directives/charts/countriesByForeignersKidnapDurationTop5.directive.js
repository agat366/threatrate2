(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersKidnapDurationTop5',
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

                    data = _.sortBy(data, 'value').slice(data.length - 5).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        d.valueTitle = 'days';
                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        d.color = color,
                        d.icon = {
                            name: 'countries.' + d.name,
                            scale: { width: 50, height: 50 }
                        };

                    }

                    var options = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                margin: {
                                    left: 25,
                                    right: 25
                                },
                                title: {
                                    dy: -10
                                },
                                title2: {
                                    dy: -45
                                },
                                legend: {
                                    icon: {
                                        height: 70,
                                        dy: 70
                                    },

                                    height: 120,
                                    dy: -90
                                }
                            }
                        };
                        var ch = new chartHourglass({
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByForeignersKidnapDurationTop5.html'
            };

            return directive;
        }
    ]);
}());