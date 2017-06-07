(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByUnrestTop5',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'colorsService',
        function (common, config, chartsHelper, $timeout, colorsService) {

            var defaults = {
                columns: 6,
                rows: 31,
                levelPoints: 5
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {

                    var colors = colorsService.getSchema(colorsService.schemas.levels10)
                        .reverse();

                    scope.getColor = function(i) {
                        return i < colors.length ? colors[i] : colors[colors.length - 1];
                    };

                    var data = _.sortBy(scope.data, 'value').reverse();
                    if (!data) {
                        return;
                    }

                    data = data.slice(0, 5);

                    for (var l = 0; l < data.length; l++) {
                        var d = data[l];
                        d.value = _(d.unrest_categories).reduce(function (m, x) { return m + (x.value || 0); }, 0);

                        d.icon = {
                            name: 'countries.' + d.name
                        };
                    }

//                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    scope.columns = _.sortBy(data, 'value').reverse();

                    scope.categories = !data.length ? [] : _.map(data[0].unrest_categories, function (u) { return u; });

                    $timeout(processCharts, 0);




                    function processCharts() {

                        var items = element.find('[chart-object-name]');
                        _.each(items, function (el, i) {
                            var it = $(el);
                            var name = it.attr('chart-object-name');
                            var d = _.find(scope.columns,
                                function(c) {
                                    return c.name == name;
                                });

                            ChartsManager.renderImage(it.find('.country')[0],
                                d.icon.name,
                                ChartsManager.defaults.secondaryBackColor,
                                -1,
                                true);

                            // chart

                            var unrestData0 = _.map(d.unrest_categories, function (u, i) {
                                var value = u.value || 0;
                                var color = i < colors.length ? colors[i] : colors[colors.length - 1];
//                                var color = colorsService.getColor(colorsService.schemas.levels10, value, d.value);
                                return {
                                    title: '',//u.value,
                                    value: value,
                                    color: color
                                }
                            });
                            var unrestData = [{
                                title: '', value: d.value || 0, color:
                                    colors[0]
//                                    colorsService.getColor(colorsService.schemas.levels10, d.value, d.value)
                            }];
                            unrestData.push.apply(unrestData, unrestData0);

                            var chartContainer = it.find('[chart-body]');
                            chartContainer.html('');

                                var options = {
                                    layout: {
                                        bars: {
                                            maxValue: 1,
                                            title: {
                                                width: 25
                                            },
                                            separator: {
                                                visible: false,
                                                width: 0,
                                                radius: 0
                                            },
                                            bar: {
                                                width: 110,
                                                height: 20,
                                                margin: {
                                                    top: 7,
                                                    bottom: 5
                                                },
                                                background: '#e3e3e3'
                                            },
                                            value: {
                                                width: 20
                                            },
                                            value2: {
                                                width: 0
                                            }
                                        }
                                    }/*
                                layout: {
                                    padding: {
                                        top: 20,
                                        left: 5,
                                        right: 5,
                                        bottom: 0
                                    }
                                }
    */
                                };
                                var ch = new chartBoxLinearHorizontal({
                                    data: unrestData,
                                    container: chartContainer[0],
                                    options: options
                                });


                            });
                    }
                    return;

                    scope.columns = [];
                    for (var i = 0; i < defaults.columns; i++) {
                        var column = { items: [] };
                        scope.columns.push(column);

                        for (var j = 0; j < defaults.rows; j++) {
                            var n = i * defaults.rows + j;
                            var d;
                            if (n < data.length) {
                                d = data[n];
                            } else {
                                d = {};
                            }

                            d.levels = [];
                            var level = d.value / maxValue * defaults.levelPoints;
                            for (var k = 0; k < defaults.levelPoints; k++) {
                                d.levels.push({ active: k <= level });
                            }

                            column.items.push(d);
                        }
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByUnrestTop5.html'
            };

            return directive;
           
        }
    ]);
}());