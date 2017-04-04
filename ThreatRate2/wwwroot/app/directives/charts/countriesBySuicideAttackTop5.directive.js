(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesBySuicideAttackTop5',
    [
        'common', 'config', 'chartsHelper', '$timeout',
        function (common, config, chartsHelper, $timeout) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    var colors = [
                        '#6c1a12',
                        '#8a281c',
                        ChartsManager.defaults.frontColor,
                        ChartsManager.defaults.frontColor,
                        ChartsManager.defaults.frontColor
                    ];

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

                    for (var i = 0; i < data.length && i < 5; i++) {
                        var g = g0.append('g');
                        g.attr('transform', String.format('translate({0},{1})',
                            frame.w / 5 * (i + .5), frame.h / 2 + 20));

                        var opacity = i > 2 ? 1 - (i - 2) * .15 : 1;
                        var icon = ChartsManager.renderImage(g,
                            ChartsManager.paths.signs.suicide,
//                            ChartsManager.paths.signs.suicide,
                            colors[i],
                            { width: 250, height: 250, position: 0, dy: -120 }, true);
                        if (opacity !== 1) {
                            icon.style('opacity', opacity);
                        }

                        ChartsManager.renderImage(g,
                            'countries.' + data[i].name,
                            ChartsManager.defaults.secondaryBackColor,
                            { width: 100, height: 100, position: 0, dy: 95 }, true);

//                        ChartsManager.renderImage(g,
//                            ChartsManager.paths.signs.clock, '#fff',
//                            { width: 40, height: 40, position: 0, dy: 30 }, true);

                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, 175)')
                            .append('text')
                            .text(data[i].title);

                        var valueTitle = g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, 200)')
                            .append('text')
                            .text(data[i].value + ' days')
                            .attr('fill', colors[i]);
                        if (opacity !== 1) {
                            valueTitle.style('opacity', opacity);
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesBySuicideAttackTop5.html'
            };

            return directive;
        }
    ]);
}());