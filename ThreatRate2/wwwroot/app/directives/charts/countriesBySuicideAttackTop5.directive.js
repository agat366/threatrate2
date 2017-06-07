(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesBySuicideAttackTop5',
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

                    data = _.sortBy(data, 'value').reverse();

                    var container = element.find('[chart-body]');
                    container.html('');

                    var g0 = ChartsManager.renderImage(container[0]);
                    g0 = d3.select($(g0[0]).parent('svg')[0]);
                    g0.style('overflow', 'visible');

                    var frame = {
                        w: container[0].offsetWidth,
                        h: container[0].offsetHeight
                    };

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                    var barsDelay = 75;
                    var barRowsDelay = 8;
                    var barDuration = 350;

                    for (var i = 0; i < data.length && i < 5; i++) {
                        var d = data[i];

                        var g = g0.append('g');
                        g.attr('transform', String.format('translate({0},{1})',
                            frame.w / 5 * (i + .5), frame.h / 2 + 20));

                        var core = g.append('g');
                        var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                        var opacity = i > 2 ? 1 - (i - 2) * .15 : 1;
                        var icon = ChartsManager.renderImage(core,
                            ChartsManager.paths.signs.suicide,
//                            ChartsManager.paths.signs.suicide,
                            color,
                            { width: 250, height: 250, position: 0, dy: -120 }, true);
                        if (opacity !== 1) {
                            icon.style('opacity', opacity);
                        }

                        // legend
                        var legend = g.append('g');
                        ChartsManager.renderImage(legend,
                            'countries.' + d.name,
                            ChartsManager.defaults.backColor,
                            { width: 100, height: 100, position: 0, dy: 95 }, true);

//                        ChartsManager.renderImage(g,
//                            ChartsManager.paths.signs.clock, '#fff',
//                            { width: 40, height: 40, position: 0, dy: 30 }, true);

                        legend.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, 175)')
                            .append('text')
                            .text(d.title);

                        var valueTitle = legend.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, 210)')
                            .append('text')
                            .text(d.value)
                            .attr('fill', color);
                        if (opacity !== 1) {
                            valueTitle.style('opacity', opacity);
                        }


                        core.style('opacity', 0);
                        core.attr('transform', 'translate(-25,0)');

                        core.transition()
                            .remove();
                        core.transition()
                            .ease('cubic-out')
                            .duration(barDuration * 1.7)
                            .delay(i * barsDelay)
                            .style('opacity', 1)
                            .attr('transform', 'translate(0,0)');


                        legend.style('opacity', 0);

                        legend.transition()
                            .remove();
                        legend.transition()
                            .ease('linear')
                            .duration(barDuration * 1.2)
                            .delay(i * barsDelay)
                            .style('opacity', 1);

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesBySuicideAttackTop5.html'
            };

            return directive;
        }
    ]);
}());