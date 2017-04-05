﻿(function () {
    'use strict';


    angular.module('tr').directive('chartTerroristAttackTypes',
    [
        'common', 'config', 'chartsHelper',
        function (common, config, chartsHelper) {

            var defaults = {
            };

            var colors = [
                '#8fd5e3',
                '#45abb6',
                '#296886',
                '#c1c1c1',
                '#e1482c',
                '#bc3d28'
            ].reverse();


            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    data = _.sortBy(data, 'value').slice(data.length - 10).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    
                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    var total = _.reduce(_.map(data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var svg = ChartsManager.renderImage(chartsContainer, null);
                    var frameContainer = { w: chartsContainer[0].offsetWidth, h: chartsContainer[0].offsetHeight };
                    _.each(data, function (d, i) {

                        d.color = i < colors.length ? colors[i] : colors[colors.length - 1];
                        d.icon = {
//                            name: 'attacks.' + d.name,
                            name: 'threattypes.' + d.name,
                            color: d.color
                        };


                        var dx = frameContainer.w / data.length;

                        var g = svg.append('g').append('g')
                            .attr('transform', String.format('translate({0},{1})', dx * (i + .5), 0));

                        var frame = {
                            w: dx,
                            h: frameContainer.h,
                            legend: {
                                height: 150,
                                diff: 45,
                                title: {
                                    width: 130,
                                    height: 25,
                                    radius: 15
                                }
                            },
                            icon: {
                                height: 40
                            },
                            bar: {
                                height: 0,
                                padding: {
                                    bottom: 25,
                                    top: 30
                                }
                            }
                        }
                        frame.bar.height = frame.h - frame.icon.height - frame.legend.height;

                        var legend = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.bar.height + frame.icon.height));

                        var bar = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.bar.height - frame.bar.padding.bottom));

                        // icon rendering
                        var icon = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.bar.height + frame.icon.height / 2));

                        icon.append('circle')
                            .attr({
                                cx: 0, cy: 0, r: 40, fill: '#fff',
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                'stroke-width': 1
                            });

                        ChartsManager.renderImage(icon.append('g'), d.icon.name,
                            ChartsManager.defaults.secondaryBackColor,
                            { width: frame.icon.height + 10, height: frame.icon.height + 10, position: 0 }, true);

                        var isOdd = i % 2 === 1;
                        // legend rendering
                        legend.append('line')
                            .attr({
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: frame.legend.height - (isOdd ? 0 : frame.legend.diff),
                                stroke: ChartsManager.defaults.secondaryBackColor
                            });
                        legend.append('rect')
                            .attr({
                                x: -frame.legend.title.width / 2,
                                width: frame.legend.title.width,
                                y: frame.legend.height - frame.legend.title.height - (isOdd ? 0 : frame.legend.diff),
                                height: frame.legend.title.height,
                                rx: frame.legend.title.radius,
                                ry: frame.legend.title.radius,
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                fill: '#fff'
                            });
                        legend.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.legend.height - frame.legend.title.height
                                + 17 - (isOdd ? 0 : frame.legend.diff)))
                            .append('text')
                            .text(d.title);


                        // bar rendering
                        var barIn = bar.append('g');
                        var barFrame = {
                            w: frame.w,
                            h: frame.bar.height - frame.bar.padding.bottom - frame.bar.padding.top
                        };
                        var h = d.value / maxValue * barFrame.h;

                        barIn.attr('transform', String.format('translate({0},{1})', 0, -h));

                        barIn.append('line')
                            .attr({
                                x1: 0, y1: 0, x2: 0, y2: h + frame.bar.padding.bottom,
                                stroke: ChartsManager.defaults.secondaryBackColor
                            });
                        var barValue = barIn.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', String.format('translate({0},{1})', 0, -frame.bar.padding.top));
                        barValue.append('rect')
                            .attr({
                                x: -25, width: 50,
                                y: 0, height: 50,
                                rx: 8, ry: 8,
                                fill: d.color
                            });
                        barValue.append('text')
                            .text(Math.round(d.value / total * 1000) / 10 + '%')
                            .attr('transform', String.format('translate({0},{1})', 0, 30));
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/terroristAttackTypes.html'
            };

            return directive;
        }
    ]);
}());