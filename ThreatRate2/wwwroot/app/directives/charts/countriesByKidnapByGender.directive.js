(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapByGender',
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

                    scope.totalMales = _.reduce(_.map(data, function (el) { return el.males; }),
                        function (memo, num) { return memo + num; }, 0);
                    scope.totalFemales = _.reduce(_.map(data, function (el) { return el.females; }),
                        function (memo, num) { return memo + num; }, 0);

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var chartData = _.map(data,
                            function(d, i) {
                                var chartData = {
                                    value: [
                                        {
                                    valueTitle: d.males,
                                    value: d.males
                                        },
                                        {
                                    valueTitle: d.females,
                                            value: d.females
                                        }
                                    ],
                                    icon: {
                                        name: 'countries.' + d.name,
                                        scale: { width: 50, height: 50 },
                                        position: 0,
                                        dy: -25,
                                        dx: -25,
                                        toCenter: true
                                    },
                                    title: d.title/*,
                                            title2: d.males + d.females*/
                                };
                                return chartData;
                            });

                        var options = {
                            bars: {
//                                height: 400,
                                width: 58,
                                maxValueRangeMultiplier: 1.22,
//                                maxValue: _.max([scope.totalMales, scope.totalFemales]) * 1.23, // to have space for the top icon and title
                                title: {
                                    isVertical: true,
                                    dy: -10,
                                    dx: 6
                                },
                                topIcon: null,
                                margin: {
                                    right: 12,
                                    left: 12
                                },
                                colors: [
                                    '#bbd6e4', '#b02819'
                                ]
                            },
                            legend: {
                                height: 100,
                                icon: {
                                    color: ChartsManager.defaults.backColor,
                                    scale: {
                                        width: 45,
                                        height: 45
                                    }
                                },
                                title: {
                                    height: 30,
                                    dy: 10
                                }
                            }
                        };
                        var ch = new chartSlicedBarVertical({
                            data: chartData,
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByKidnapByGender.html'
            };

            return directive;
        }
    ]);
}());