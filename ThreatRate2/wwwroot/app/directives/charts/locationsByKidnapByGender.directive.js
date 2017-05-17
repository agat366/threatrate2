(function () {
    'use strict';


    angular.module('tr').directive('chartLocationsByKidnapByGender',
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
                                        name: d.name === 'unknown' || !d.name ? 'signs.unknown' :
                                            ('locations.' + (d.name === 'other' ? 'common' : d.name)),
                                        scale: { width: 40, height: 40 },
                                        //                            position: 0,
                                        dx: -20, dy: -20,
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
                                maxValueRangeMultiplier: 1.26,
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
                                    colorsService.getColor(colorsService.schemas.male),
                                    colorsService.getColor(colorsService.schemas.female)
                                 ]
                            },
                            legend: {
                                height: 100,
                                icon: {
                                    color: ChartsManager.defaults.darkColor,
                                    scale: {
                                        width: 40,
                                        height: 40
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/locationsByKidnapByGender.html'
            };

            return directive;
        }
    ]);
}());