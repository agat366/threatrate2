(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersKidnapTop10',
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

                    data = _.sortBy(data, 'value').slice(data.length - 10).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        d.valueTitle = d.value;
                        d.color = i < colors.length ? colors[i] : colors[colors.length - 1],
                        d.icon = {
                            name: 'countries.' + d.name,
                            scale: { width: 50, height: 50 }
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByForeignersKidnapTop10.html'
            };

            return directive;
        }
    ]);
}());