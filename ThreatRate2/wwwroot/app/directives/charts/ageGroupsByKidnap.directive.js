(function () {
    'use strict';


    angular.module('tr').directive('chartAgeGroupsByKidnap',
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

//                    scope.total = _.reduce(_.map(data, function (el) { return el.value; }),
//                        function (memo, num) { return memo + num; }, 0);

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    for (var i = 0; i < data.length; i++) {
                        var it = data[i];

                        if (it.name === '1-10') {
                            it.icon = {
                                name: ChartsManager.paths.ageGroups.children,
                                dy: 12
                            }
                        } else if (it.name === '11-18') {
                            it.icon = {
                                name: ChartsManager.paths.ageGroups.adults,
                                scale: 1.6,
                                dy: 13
                            }
                        } else if (it.name === '66-up') {
                            it.icon = {
                                name: ChartsManager.paths.ageGroups.senior
                            }
                        } else {
                            it.icon = {
                                name: ChartsManager.paths.ageGroups.adults
                            }
                        }
                    }

                    var colors = [
                        '#8fd5e3',

                        '#8fd5e3',
                        '#45abb6',
                        '#296886',
                        '#c1c1c1',
                        '#e1482c',
                        '#bc3d28'
                    ];
                    var orderedGroups = _.sortBy(data, 'value');
                    _.each(orderedGroups,
                        function(c, i) {
                            c.color = colors[i];
                        });

                    var options = {
                        bars: {
                            height: 400,
                            width: 100,
//                            maxValue: _.max(_.map(data, function (el) { return el.value; })) * 1.23, // to have space for the top icon and title
//                            title: {
//                                dy: -10
//                            },
                        },
                        legend: {
                            height: 120,
                            title: {
                                height: 20
                            },
                            icon: {
                                scale: 2.25,
                                color: ChartsManager.defaults.secondaryBackColor,
                                dy: 7
                            }
                        },
                        layout: {
                            padding: {
                                left: 40,
                                right: 40,
                                top: 100
                            }
                        }
                    };
                    var ch = new chart3DBarVertical({
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/ageGroupsByKidnap.html'
            };

            return directive;
        }
    ]);
}());