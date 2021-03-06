﻿(function () {
    'use strict';


    angular.module('tr').directive('chartRegionsByVehicleAttack',
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

                    var colors = colorsService.getSchema(colorsService.schemas.fixed6v2).reverse();


                    data = _.sortBy(data, 'value').slice(data.length - 6).reverse();

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');


                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));
                    _.each(data, function (d, i) {

                        d.color = i < colors.length ? colors[i] : colors[colors.length - 1];
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

                        if (d.name === 'africa') {
                            scale /= 1.25;
                        } else if (d.name === 'samerica') {
                            scale /= 1.2;
                        } else if (d.name === 'australia') {
                            scale /= 1.35;
                        }

                        _.each(mask,
                            function(m) {
                                maskContainer.selectAll('path')
//                                    .attr('d', d3.select(m).attr('d'))
//                                    .attr('transform-origin', 'center')
                                    .attr('transform', String.format('translate({0}, {1}), scale(1)',
                                        -clipBox.x + (frame.w - clipBox.width) / 2 * 0,
                                        -clipBox.y + (frame.h - clipBox.height) / 2 * 0));
                            });

                        maskContainer
//                                    .attr('transform-origin', 'center')
//                            .attr('transform', String.format('translate({0}, {1}), scale({2})',
                            .attr('transform', String.format('translate({0},{1}), scale({2})',
                                (frame.w - clipBox.width * scale) / 2 * 1,
                                (frame.h - clipBox.height * scale) / 2 * 1,
                                scale));

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
                                fill: ChartsManager.defaults.darkColor
                            });

                        var barOut = fill.append('g')
                            .attr('transform', 'skewY(45)');

                        var bar = barOut.append('rect')
                            .attr({
                                x: 0,
                                y: 0,
                                width: frame.w,
                                height: frame.h * 2.5,
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
//                            .style('color', d.color)
                            .html(d.value);

                        // transitions
                        var barsDelay = 25 * 8;
                        var barRowsDelay = 8;
                        var barDuration = 1000;

                        var h = barHeight; //d.value / maxValue * barHeight;
                        bar.transition()
                            .remove();
                        bar.transition()
                            .ease('linear')
                            .duration(barDuration * 2.5 + (data.length - i) * 240 * 0)
                            .delay(i * barsDelay)
                            .attr('transform', String.format('translate({0}, {1})', 0, -h * 2.5))
                            .attr('fill', d.color);

                        background.transition()
                            .remove();
                        background.transition()
                            .ease('linear')
                            .duration(barDuration * .3)
                            .delay(0)
                            .style('opacity', .9)
                        .transition()
                            .ease('quad-out')
                            .duration(barDuration * 1.5)
                            .delay(barDuration * .3)
                            .style('opacity', .15);

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'regionsByVehicleAttack.html'
            };

            return directive;
        }
    ]);
}());