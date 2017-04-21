(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersKidnapDurationTop5',
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

                    data = _.sortBy(data, 'value').slice(data.length - 5).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        d.valueTitle = 'days';
                        d.color = i < colors.length ? colors[i] : colors[0],
                        d.icon = {
                            name: 'countries.' + d.name,
                            scale: { width: 50, height: 50 }
                        };

                    }
                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                    var options = {
                            layout: {
                                rows: {
                                    count: 4
                                }
                            },
                            bars: {
                                margin: {
                                    left: 40,
                                    right: 40
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByForeignersKidnapDurationTop5.html'
            };

            return directive;
        }
    ]);
}());