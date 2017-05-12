(function () {
    'use strict';


    angular.module('tr').directive('chartAgeGroupsByKidnapDurationGrid',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'colorsService',
        function (common, config, chartsHelper, $timeout, colorsService) {

            var defaults = {
            };

            var colors = colorsService.getSchema(colorsService.schemas.fixed6);

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

                    scope.groups = data;//_.sortBy(data, 'duration').reverse();

                    var maxValue = _.max(_.map(data, function(el) { return el.value; })); // to have space for the top icon and title

                    var orderedGroups = _.sortBy(data, 'value');
                    var groupsWithoutNA = _.filter(orderedGroups, function (f) { return f.name != 'N/A'; });
                    var naGroup = _.find(orderedGroups, { name: 'N/A' });
                    var closestToNaValue = null;

                    _.each(groupsWithoutNA,
                        function(c, i) {
                            c.color = i < colors.length ? colors[i] : colors[colors.length - 1];
                            if (naGroup) {
                                var dv = Math.abs(c.value - naGroup.value);
                                if (!closestToNaValue || dv < Math.abs(naGroup.value - closestToNaValue.value)) {
                                    closestToNaValue = c;
                                }
                            }
                        });
                    if (closestToNaValue) {
                        naGroup.color = closestToNaValue.color;
                    }

                    $timeout(function () {

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
                                        width: 60,
                                        maxValue: maxValue,
                                        //                            title: {
                                        //                                dy: -10
                                        //                            },
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
                                            left: 10,
                                            right: 10,
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