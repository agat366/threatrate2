(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByLongestKidnapDurationTop3',
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

                    data = _.sortBy(data, 'value').reverse();

                    var container = element.find('[chart-body]');
                    container.html('');

                    var g0 = ChartsManager.renderImage(container[0],
                        ChartsManager.paths.countries.globe,
                        ChartsManager.defaults.backColor,
                        1.5);
                    g0 = d3.select($(g0[0]).parent('svg')[0]);

                    var frame = {
                        w: container[0].offsetWidth,
                        h: container[0].offsetHeight
                    };

                    for (var i = 0; i < data.length && i < 3; i++) {
                        var g = g0.append('g');
                        g.attr('transform', String.format('translate({0},{1})',
                            frame.w / 3 * (i + .5 + (i === 0 ? .1 : i === 2 ? -.1 : 0)), frame.h / 3));

                        ChartsManager.renderImage(g,
                            'countries.' + data[i].name,
                            ChartsManager.defaults.frontColor,
                            { width: 250, height: 250, position: 0 }, true);

                        ChartsManager.renderImage(g,
                            ChartsManager.paths.signs.clock, '#fff',
                            { width: 40, height: 40, position: 0, dy: 30 }, true);

                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, -30)')
                            .append('text')
                            .text(data[i].value + ' days')
                            .attr({ stroke: ChartsManager.defaults.frontColor, 'stroke-width' : 6 });
                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, -30)')
                            .append('text')
                            .text(data[i].value + ' days');
                            
                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, 0)')
                            .append('text')
                            .text(data[i].title);
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByLongestKidnapDurationTop3.html'
            };

            return directive;
        }
    ]);
}());