(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapKilledTop5',
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

                    data = _.sortBy(data, 'value').slice(data.length - 5).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    
                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    _.each (data, function(d, i) {
                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        d.color = color,
                        d.icon = {
                            name: 'countries.' + d.name,
                            color: d.color
                        };

                        var cont = $('<div></div>').appendTo(chartsContainer);

                        var frame = { w: cont[0].offsetWidth, h: cont[0].offsetHeight };
                        var g0 = ChartsManager.renderImage(cont);
                        g0 = d3.select($(g0[0]).parent('svg')[0]);

                        var g = g0.append('g')
                            .attr('transform', String.format('translate({0},{1})', frame.w / 2, frame.h / 2));
                        g.append('g')
                            .append('rect')
                            .attr({
                                width: frame.w,
                                height: frame.h,
                                rx: 42,
                                ry: 42,
                                x: -frame.w / 2,
                                y: -frame.h / 2,
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                fill: ChartsManager.defaults.backColor,
                                'stroke-width': 2,
                                'stroke-dasharray': '6,6'
                            });

                        var country = ChartsManager.renderImage(g,
                            d.icon,
                            d.icon.color,
                            { width: 100, height: 100, position: 0, dy: frame.h / 5 },
                            true);

                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', String.format('translate({0},{1})', 0, frame.h / 2.5 + 10))
                            .append('text')
                            .text(d.title);

                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', String.format('translate({0},{1})', 0, -frame.h / 2.5))
                            .append('text')
                            .text(d.value);

                        var chart = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', -frame.w / 2, -frame.h / 5 * 2 + 10));

                        var options = {
                            bars: {
                                fullFillMode: false,
//                                oneItemMode: true,
                                radiusInner: 20,
                                radius: 67,
                                background: {
                                    width: 3,
                                    color: '#aaa',//ChartsManager.defaults.secondaryBackColor
                                }
                            },
                            layout: {
                                width: frame.w,
                                height: frame.w
                            }
                        };

                        var bagelData = [];
                        bagelData.push({
                            value: d.value / maxValue - .000001,
                            color: d.icon.color
                        });
                        bagelData.push({
                            value: 1 - d.value / maxValue,
                            color: ChartsManager.defaults.secondaryBackColor
                        });

                        var ch = new chartBoxDonut({
                            data: bagelData,
                            container: chart,
                            options: options
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByKidnapKilledTop5.html'
            };

            return directive;
        }
    ]);
}());