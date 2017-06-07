(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersVsLocalsKidnapTop10',
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

                    var foreign = {
                         data: _.sortBy(data.foreign, 'value').slice(data.length - 10).reverse()
                    };
                    scope.foreign = foreign.data;

                    var local = {
                        data: _.sortBy(data.local, 'value').slice(data.length - 10).reverse()
                    };
                    scope.local = local.data;

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    foreign.total = _.reduce(_.map(foreign.data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);
                    local.total= _.reduce(_.map(local.data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var maxValue = _.max([
                        _.max(_.map(foreign.data, function(d) { return d.value; })),
                        _.max(_.map(local.data, function(d) { return d.value; }))
                    ]);

                    _.each([foreign, local],
                        function(it, i) {
                            for (var j = 0; j < it.data.length; j++) {
                                var d = it.data[j];

                                var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                                d.valueTitle = d.value;
                                d.value2Title = (Math.round(d.value / it.total * 1000) / 10) + '%';
                                d.color = color,
                                d.icon = null;
//                                d.titleColor = d.color;

                                d.value = i === 0 ? d.value : (maxValue - d.value);

                            }

                            var options = {
                                
                                layout: {
                                    rows: {
                                        count: 3,
                                        dy: i === 0 ? 0 : 65
                                    },
                                    columns: null,
                                    padding: {
                                        top: 3,
                                        bottom: 70
                                    }
                                },
                                bars: {
                                    graph: {
                                        dy: i === 0 ? 0 : -65
                                    },
                                    maxValue: maxValue,
                                    maxValueRangeMultiplier: 1.55,
                                    icon: {
                                        name: i === 0 ? 'signs.foreigner' : 'signs.local',
                                        height: 25,
                                        dx: 0,
                                        dy: i === 0 ? -10 : 62,
                                        scale: .9
                                    },
                                    value: {
                                        dy: i === 0 ? 0 : -38
                                    },
                                    value2: {
                                        dy: i === 0 ? 0 : -78
                                    },
                                    legend: {
                                        icon: null,

                                        height: 0
                                    }
                                },
                                animation: {
                                    barDelay: 20
                                }
                            };
                            var ch = new chartGridVertical({
                                data: it.data,
                                container: chartsContainer[i],
                                options: options
                            });

                            // lines with arrows
                            var gArrows = d3.select(chartsContainer[i]).selectAll('svg').append('g');
                            var w = chartsContainer[i].offsetWidth;
                            var h = chartsContainer[i].offsetHeight;
                            var dx = w / it.data.length;

                            var arrowsBarHeight = 110;
                            var arrowsBarBasicHeight = 10;
                            var arrowsBarPadding = 5;

                            var isBottomUp = i === 0;
                            var barsDelay = 25;
                            var barDuration = 400;

                            for (var j = 0; j < it.data.length; j++) {
                                var d = it.data[j];
                                var value = isBottomUp ? d.value : (maxValue - d.value);
                                var valueHeight = value / maxValue * arrowsBarHeight + arrowsBarBasicHeight;

                                var g = gArrows.append('g')
                                    .attr('transform', String.format('translate({0}, {1})',
                                        dx * (.5 + j), isBottomUp ? h - arrowsBarPadding : arrowsBarPadding));

                                var arrow = g.append('g')
                                    .attr('transform', String.format('translate({0}, {1})', 0, 0))
                                    .style('opacity', 0);

                                arrow.append('polygon')
                                    .attr('points', '3.703,4.389 1.852,3.603 0,4.389 1.852,0')
                                    .attr('fill', d.color)
                                    .attr('transform', String.format('translate(-3.65, -3.65) scale(2) {0}', isBottomUp ? '' : 'rotate(180, 1.825, 1.825)'));

                                var line = g.append('line')
                                    .attr({
                                         x1: 0,
                                         x2: 0,
                                         y1: 0,
                                         y2: 0,
                                         stroke: d.color,
                                         'stroke-width': 2
                                    })
                                    .style('opacity', 0);


                                arrow.transition()
                                    .remove();
                                arrow.transition()
                                    .ease('cubic-out')
                                    .duration(barDuration * 1.8)
                                    .delay(j * barsDelay)
                                    .attr('transform', String.format('translate({0}, {1})', 0, isBottomUp ? -valueHeight : valueHeight))
                                    .style('opacity', 1);

                                line.transition()
                                    .remove();
                                line.transition()
                                    .ease('cubic-out')
                                    .duration(barDuration * 1.8)
                                    .delay(j * barsDelay)
                                    .attr('y1', isBottomUp ? -valueHeight : valueHeight)
                                    .style('opacity', 1);
                            }

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByForeignersVsLocalsKidnapTop10.html'
            };

            return directive;
        }
    ]);
}());