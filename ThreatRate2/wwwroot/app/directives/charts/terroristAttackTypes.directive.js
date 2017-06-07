(function () {
    'use strict';


    angular.module('tr').directive('chartTerroristAttackTypes',
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

                    data = _.sortBy(data, 'value')./*slice(data.length - 10).*/reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    
                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    var total = _.reduce(_.map(data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var svg = ChartsManager.renderImage(chartsContainer, null);
                    var frameContainer = {
                        w: chartsContainer[0].offsetWidth,
                        h: chartsContainer[0].offsetHeight,
                        padding: {
                            left: 30,
                            right: 30
                        }
                    };
                    frameContainer.inner = {
                        w: frameContainer.w - frameContainer.padding.left - frameContainer.padding.right,
                        h: frameContainer.h
                    };
                    var g0 = svg.append('g')
                        .attr('transform', String.format('translate({0},{1})', frameContainer.padding.left, 0));

                    _.each(data, function (d, i) {

                        var color = colorsService.getColor(colorsService.schemas.levels6, d.value, maxValue);

                        d.color = color;
                        d.icon = {
//                            name: 'attacks.' + d.name,
                            name: d.name === 'other' ? 'signs.unknown' :
                                ('threattypes.' + d.name),
                            color: d.color
                        };


                        var dx = frameContainer.inner.w / data.length;

                        var gOut = g0.append('g')
                            .attr('transform', String.format('translate({0},{1})', dx * (i + .5), 0));

                        var g = gOut.append('g');

                        var frame = {
                            w: dx,
                            h: frameContainer.h,
                            legend: {
                                height: 150,
                                diff: 45,
                                title: {
                                    width: 108,
                                    height: 25,
                                    radius: 15
                                }
                            },
                            icon: {
                                height: 35
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

                        var barOut = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.bar.height - frame.bar.padding.bottom));
                        var bar = barOut.append('g');

                        // icon rendering
                        var icon = g.append('g')
                            .attr('transform', String.format('translate({0},{1})', 0,
                                frame.bar.height + frame.icon.height / 2 + 10));

                        icon.append('circle')
                            .attr({
                                cx: 0, cy: 0, r: 26, fill: '#fff',
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                'stroke-width': 2
                            });

                        ChartsManager.renderImage(icon.append('g'), d.icon.name,
                            ChartsManager.defaults.secondaryBackColor,
                            { width: frame.icon.height, height: frame.icon.height, position: 0 }, true);

                        var isOdd = i % 2 === 1;
                        // legend rendering
                        legend.append('line')
                            .attr({
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: frame.legend.height - (isOdd ? 0 : frame.legend.diff),
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                'stroke-width': 2
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
                                fill: '#fff',
                                'stroke-width': 2
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
                                stroke: ChartsManager.defaults.secondaryBackColor,
                                'stroke-width': 2
                            });
                        var barValue = barIn.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', String.format('translate({0},{1})', 0, -frame.bar.padding.top));
                        barValue.append('rect')
                            .attr({
                                x: -27, width: 54,
                                y: -5, height: 54,
                                rx: 8, ry: 8,
                                fill: d.color
                            });
                        barValue.append('text')
                            .text(Math.round(d.value / total * 1000) / 10 + '%')
                            .attr('transform', String.format('translate({0},{1})', 0, 30));


                        var barsDelay = 25;
                        var barRowsDelay = 8;
                        var barDuration = 400;

                        g.attr('transform', 'translate(-30, 0)')
                            .style('opacity', 0);

                        g.transition()
                            .remove();
                        g.transition()
                            .ease('cubic-out')
                            .duration(barDuration * .75)
                            .delay(i * barsDelay * .5)
                            .style('opacity', 1)
                            .attr('transform', 'translate(0,0)');
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'terroristAttackTypes.html'
            };

            return directive;
        }
    ]);
}());