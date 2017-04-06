(function () {
    'use strict';


    angular.module('tr').directive('chartAgeGroupsByKidnapDurationGrid',
    [
        'common', 'config', 'chartsHelper', '$timeout',
        function (common, config, chartsHelper, $timeout) {

            var defaults = {
            };

            var colors = [
                '#8fd5e3',
                '#45abb6',
                '#296886',
                '#c1c1c1',
                '#e1482c',
                '#bc3d28'
            ];

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    scope.groups = data;//_.sortBy(data, 'duration').reverse();

                    var maxValue = _.max(_.map(data, function(el) { return el.value; })); // to have space for the top icon and title

                    _.each(_.sortBy(data, 'value'),
                        function(d, i) {
                            d.color = colors[i];
                        });
                    $timeout(function() {

                        var containers = element.find('[chart-body="age-group"]');

                        _.each(scope.groups, function(group, i) {
                                var container = $(containers[i]);
                                container.html('');

                                var barData = [group];

                                var it = group;

                                if (it.name === '1-10') {
                                    it.icon = {
                                        name: ChartsManager.paths.ageGroups.children,
                                        dy: 16
                                    }
                                } else if (it.name === '11-18') {
                                    it.icon = {
                                        name: ChartsManager.paths.ageGroups.adults,
                                        scale: 1.6,
                                        dy: 17
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

                                var options = {
                                    bars: {
                                        height: 250,
                                        width: 120,
                                        maxValue: maxValue,
                                        //                            title: {
                                        //                                dy: -10
                                        //                            },
                                        margin: {
                                            right: 10,
                                            left: 10
                                        },
                                        title: {
                                            height: 1
                                        }
                                    },
                                    legend: {
                                        height: 120,
                                        title: {
                                            height: 20
                                        },
                                        icon: {
                                            scale: 2.25,
                                            color: ChartsManager.defaults.darkColor,
                                            dy: 7
                                        }
                                    },
                                    layout: {
                                        padding: {
                                            left: 40,
                                            right: 40,
                                            top: 45
                                        }
                                    }
                                };
                                var ch = new chart3DBarVertical({
                                    data: barData,
                                    container: container[0],
                                    options: options
                                });
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/ageGroupsByKidnapDurationGrid.html'
            };

            return directive;
        }
    ]);
}());