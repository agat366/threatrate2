(function () {
    'use strict';


    angular.module('tr').directive('chartMonthsByKidnap',
    [
        'common', 'config', 'chartsHelper',
        'colorsService',
        function (common, config, chartsHelper, colors) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

//                    scope.total = _.reduce(_.map(data, function (el) { return el.value; }),
//                        function (memo, num) { return memo + num; }, 0);

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    var sortedData = _.orderBy(data, 'value');
                    var threeHighest = _.map(sortedData, function (m) { return m.name; }).reverse().slice(0, 3);
                    for (var i = 0; i < data.length; i++) {
                        var it = data[i];
                        if (_.find(threeHighest, function (v) { return v === it.name })) {
                            it.color = colors.getColor(colors.schemas.high);
                            it.__marked = true;
                        } else {
                            it.color = colors.getColor(colors.schemas.additionalMedium);
                        }
                    }
                    var options = {
                        bars: {
//                            maxValue: _.max(_.map(data, function(el) { return el.value; })) * 1.1, // to have space for the top icon and title
//                            maxValueRangeMultiplier: 1,

                                title: {
                                    icon: {
                                        name: ChartsManager.paths.signs.person,
                                        color: ChartsManager.defaults.darkColor
                                    }
                                },
//                                topIcon: {
//                                    dy: -40
//                                },
                            margin: {
//                                    top: 50,
                                    right: 10,
                                    left: 10
                                }
                        },
                        layout: {
                            padding: {
                                top: 140
                            }
                        }
/*
                            legend: {
                                height: 100,
                                title: {
                                    height: 30
                                },
                                icon: {
                                    scale: 1.4,
                                    dy: -5
                                }
                            }
*/
                    };
                    var ch = new chartBubbledLines({
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'monthsByKidnap.html'
            };

            return directive;
        }
    ]);
}());