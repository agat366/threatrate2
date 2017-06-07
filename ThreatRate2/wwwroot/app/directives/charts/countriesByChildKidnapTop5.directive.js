(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByChildKidnapTop5',
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
                        d.valueTitle = d.value;
                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        d.color = color,
                        d.icon = {
                            name: 'countries.' + d.name,
                            scale: { width: 45, height: 45 }
                        };

                    }
//                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

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
                                pointMaskRadius: 110,
//                                maxValue: maxValue,
                                maxValueRangeMultiplier: 1.3,
                                icon: {
                                    name: 'signs.child',
                                    height: 45,
                                    dx: -5,
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByChildKidnapTop5.html'
            };

            return directive;
        }
    ]);
}());