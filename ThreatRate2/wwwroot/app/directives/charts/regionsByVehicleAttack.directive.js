(function () {
    'use strict';


    angular.module('tr').directive('chartRegionsByVehicleAttack',
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
                        '#ee8879',
                        '#ffcac2',
                        '#fcedeb'
                    ];


                    data = _.sortBy(data, 'value').slice(data.length - 6).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');


                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    _.each(data, function (d, i) {

                        d.color = i < colors.length ? colors[i] : colors[0],
                            d.icon = {
                                name: 'regions.' + d.name,
                                color: d.color
                            };

                        var cont = $('<div></div>').appendTo(chartsContainer);

                        var frame = { w: cont[0].offsetWidth, h: cont[0].offsetHeight };
                        var maskOut = ChartsManager.renderImage(cont, d.icon.name, null, 1);
                        var svg = d3.select($(maskOut[0]).parent('svg')[0]);
                        var clipPathName = 'region.' + d.name + '.mask';
                        var maskContainer = svg.append('defs').append('clipPath')
                            .attr('id', clipPathName);

                        var mask = $(maskOut[0]).find('path');
                        var translateContainer = $(mask[0]).parents('[translate-container]');
//                        var translate = d3.transform(translateContainer.attr('transform')).translate;
//                        var scale = d3.transform($(mask[0]).parents('[scale-container]').attr('transform')).scale;
                        var box = d3.select(translateContainer[0]).node().getBBox();
//                        var box = maskOut.node().getBBox();

//                        var maskFrame = {
//                            x: translate[0],
//                            y: translate[1],
//                            width: box.width,
//                            height: box.height
//                        }; 
                        _.each(mask,
                            function(m) {
                                maskContainer.append('path')
                                    .attr('d', d3.select(m).attr('d'))
//                                    .attr('transform-origin', 'center')
//                                    .attr('transform', String.format('translate({0}, {1}), scale(1)',
//                                        -clipBox.x,
//                                        -clipBox.y,
//                                        scale[0], scale[1]));
                            });
                        maskOut.remove();
                        var clipBox = box;
                    try
                        {
//                            maskContainer.node().getBBox();
                            
                        }catch (ex){}
                        console.log(clipBox);

                        var scaleX = frame.w / clipBox.width;
                        var scaleY = frame.w / clipBox.height;
                        var scale = scaleY > scaleX ? scaleX : scaleY;

                        _.each(mask,
                            function(m) {
                                maskContainer.selectAll('path')
//                                    .attr('d', d3.select(m).attr('d'))
//                                    .attr('transform-origin', 'center')
                                    .attr('transform', String.format('translate({0}, {1}), scale(1)',
                                        -clipBox.x + (frame.w - clipBox.width) / 2,
                                        -clipBox.y + (frame.h - clipBox.height) / 2));
                            });

                        maskContainer
                                    .attr('transform-origin', 'center')
//                            .attr('transform', String.format('translate({0}, {1}), scale({2})',
                            .attr('transform', String.format('translate(0,0), scale({2})',
                                -clipBox.x, -clipBox.y, scale));

                        var barHeight = clipBox.height * scale;
                        var g = svg.append('g');

                        var background = g.append('g')
                            .style('opacity', 0)
                            .attr('clip-path', String.format('url(#{0})', clipPathName));
                        var fill = g.append('g')
                            .attr('clip-path', String.format('url(#{0})', clipPathName))
                            .append('g')
                            .attr('transform', String.format('translate({0}, {1})',
                                0, (frame.h - barHeight) / 2 + barHeight));

                        background.append('rect')
                            .attr({
                                x: 0,
                                y: 0,
                                width: frame.w,
                                height: frame.h,
                                fill: ChartsManager.defaults.backColor
                            });

                        var bar = fill.append('rect')
                            .attr({
                                x: 0,
                                y: 0,
                                width: frame.w,
                                height: frame.h,
                                fill: ChartsManager.defaults.frontColor
                            })
                            .attr('transform', String.format('translate({0}, {1})', 0, 0));


                        var _cont = d3.select(cont[0]);
                        _cont.append('div')
                            .attr('class', 'legend-title')
                            .append('div')
                            .text(d.title);

                        _cont.append('div')
                            .attr('class', 'value-title')
                            .append('h3')
                            .style('color', d.color)
                            .html(d.value);

                        // transitions
                        var barsDelay = 25 * 0;
                        var barRowsDelay = 8;
                        var barDuration = 200;

                        var h = d.value / maxValue * barHeight;
                        bar.transition()
                            .remove();
                        bar.transition()
                            .ease('cubic-out')
                            .duration(barDuration * 1.2 + (data.length - i) * 240)
                            .delay(i * barsDelay)
                            .attr('transform', String.format('translate({0}, {1})', 0, -h))
                            .attr('fill', d.color);

                        background.transition()
                            .remove();
                        background.transition()
                            .ease('linear')
                            .duration(barDuration * 1.2 + (data.length - i) * 240)
                            .delay(i * barsDelay)
                            .style('opacity', 1);

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/regionsByVehicleAttack.html'
            };

            return directive;
        }
    ]);
}());