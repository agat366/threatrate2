(function () {
    'use strict';


    angular.module('tr').directive('chartProfessionalGroupsByKidnap',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'colorsService',
        function (common, config, chartsHelper, $timeout, colorsService) {

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

                    var unknownData = _.find(data, { name: 'unknown' });
                    if (unknownData) {
                        data = _.without(data, unknownData);
                    }
                    scope.unknownData = unknownData;

                    var colors = colorsService.getSchema(colorsService.schemas.fixed5).reverse();
                    var orderedGroups = _.sortBy(data, 'value').reverse();
                    _.each(colors,
                        function(c, i) {
                            orderedGroups[i].color = c;
                        });

                    scope.topItems = orderedGroups.slice(0, 5);
                    scope.commonItems = orderedGroups.slice(5);

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    var maxCommonValue = _.max(_.map(scope.commonItems, function (el) { return el.value; }));

                    // levels
                    var levels = element.find('[chart-body="levels"]');
                    levels.html('');

                    _.each(scope.commonItems,
                        function(it) {
                            it.color = ChartsManager.defaults.frontColor;
                            it.icon = {
                                name: ChartsManager.paths.signs.person2,
                                color: ChartsManager.defaults.secondaryBackColor,
                                dy: -3
                            }
                        });

                    var options= {
                        bars: {
                            maxValue: maxCommonValue,
                            maxValueRangeMultiplier: 1,
                            title: {
                                height: 30
                            },
                            width: 56,
//                            margin: {
//                                left: 25
//                            },
                            graph: {
                                color: ChartsManager.defaults.frontColor
                            },
                            legend: {
                                height: 110
                            }
                        },
                        layout: {
                            padding: {
                                top: 20,
                                left: 5,
                                right: 5,
                                bottom: 0
                            }
                        }
                    }
                    var ch = new chartLevelsVertical({
                        data: scope.commonItems,
                        container: levels[0],
                        options: options
                    });

                    // bagels
                    $timeout(function () {
                        _.each(element.find('[chart-body="bagel"]'), setupBagel);
                        _.each(element.find('[chart-body="icon"]'), setupIcon);
                    });

                    function setupBagel(element) {
                        var options = {
                            bars: {
                                fullFillMode: false,
                                oneItemMode: true,
                                radiusInner: 50,
                                radius: 67,
                                background: {
                                    width: 3,
                                    color: ChartsManager.defaults.secondaryBackColor
                                }
                            }
                        };

                        var el = $(element);
                        el.html('');

                        var data = [];
                        var value = parseInt(el.data('value'));
                        data.push({
                            value: value / maxValue,
                            color: el.data('color')
                        });

                        var ch = new chartBoxBagel({
                            data: data,
                            container: el[0],
                            options: options
                        });
                    }

                    function setupIcon(element) {
                        
                        var el = $(element);
                        el.html('');

                        ChartsManager.renderImage(el, ChartsManager.paths.signs.person2, el.data('color'), 1.15);
                    }
                }
            }

            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'professionalGroupsByKidnap.html'
            };

            return directive;
        }
    ]);
}());