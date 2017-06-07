(function () {
    'use strict';


    angular.module('tr').directive('chartAgeGroupsByKidnap',
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

                    var colors = colorsService.getSchema(colorsService.schemas.fixed6);

                    var orderedGroups = _.sortBy(data, 'value');
                    var groupsWithoutNA = _.filter(orderedGroups, function (f) { return f.name != 'N/A'; });
                    var naGroup = _.find(orderedGroups, { name: 'N/A' });
                    var closestToNaValue = null;
                    _.each(groupsWithoutNA,
                        function (c, i) {
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'ageGroupsByKidnap.html'
            };

            return directive;
        }
    ]);
}());