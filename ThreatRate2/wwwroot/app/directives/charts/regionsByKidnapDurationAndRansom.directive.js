(function () {
    'use strict';


    angular.module('tr').directive('chartRegionsByKidnapDurationAndRansom',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'colorsService',
        function (common, config, chartsHelper, $timeout, colorsService) {

            var defaults = {
            };

            var colors = colorsService.getSchema(colorsService.schemas.fixed6);

            var regionsOrder = [
                'namerica',
                'europe',
                'asia',
                'samerica',
                'africa',
                'australia'
            ];

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                scope.formatRansom = function (value) {
                    if (value > 100000) {
                        return (Math.round(value / 100000) / 10) + 'M';
                    } else if (value > 1000) {
                        return Math.round(value / 100) / 10 + 'K';
                    } else {
                        return value;
                    }
                };

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    var container = element.find('[chart-body]');
                    container.html('');

                    data = _.sortBy(data, 'value');
                    _.each(data, function(d, i) {
                            d.color = i < colors.length ? colors[i] : colors[0];
                    });

                    _.each(regionsOrder,
                        function(r, i) {
                            var d = _.find(data, { name: r });
                            if (d) {
                                d.__order = i;
                            };
                        });
                    data = _.sortBy(data, '__order');
                    
                    var layout = {
                        width: container[0].offsetWidth - 6,
                        height: container[0].offsetHeight - 6,
                        padding: 3
                    };

                    var svg = ChartsManager.renderImage(container, null)
                        .append('g')
                        .attr('transform', String.format('translate({0},{1})', layout.padding, layout.padding));

                    var legend = svg.append('g');
                    _.each(data,
                        function(d, i) {


                            var frame = {
                                x: 0,
                                y: 0,
                                point: {
                                    x: 0,
                                    y: 0
                                },
                                width: layout.width / 3 - 30,
                                height: 50
                            };
                            frame.daysWidth = frame.width / 2.175;
                            frame.ransomWidth = frame.width - frame.daysWidth;

                            var horizontalCorrection = .87;

                            switch (d.name) {
                                case 'europe':
                                    frame.x = layout.width / 2 - frame.width / 2;
                                    frame.y = 0;
                                    frame.point.x = 520 * horizontalCorrection * 1;
                                    frame.point.y = 130;
                                    break;
                                case 'namerica':
                                    frame.x = 0;
                                    frame.y = 0;
                                    frame.point.x = 245 * horizontalCorrection * .8;
                                    frame.point.y = 145;
                                    break;
                                case 'samerica':
                                    frame.x = 0;
                                    frame.y = layout.height - frame.height;
                                    frame.point.x = 335 * horizontalCorrection * .9;
                                    frame.point.y = 345;
                                    break;
                                case 'asia':
                                    frame.x = layout.width - frame.width;
                                    frame.y = 0;
                                    frame.point.x = 760 * horizontalCorrection * 1.01;
                                    frame.point.y = 120;
                                    break;
                                case 'africa':
                                    frame.x = layout.width / 2 - frame.width / 2;
                                    frame.y = layout.height - frame.height;
                                    frame.point.x = 560 * horizontalCorrection * 1;
                                    frame.point.y = 290;
                                    break;
                                case 'australia':
                                case 'oceania':
                                    frame.x = layout.width - frame.width;
                                    frame.y = layout.height - frame.height;
                                    frame.point.x = 860 * horizontalCorrection * 1.04;
                                    frame.point.y = 350;
                                    break;
                                
                                default:
                            }

                            var g0 = legend.append('g');
                            var g = g0.append('g')
                                .style('opacity', 0)
                                .attr('transform', String.format('translate({0},{1})', frame.x, frame.y));

                            var bck = g.append('g');
                            bck.append('rect')
                                .attr({
                                    width: frame.width,
                                    height: frame.height,
                                    stroke: ChartsManager.defaults.darkColor,
                                    'stroke-width': 2.5,
                                    'stroke-dasharray': '7,5',
                                    fill: 'none'
                                });

                            // days
                            var days = g.append('g')
                                .attr('transform', String.format('translate({0},{1})', frame.daysWidth / 2, frame.height / 2));

                            var img = days.append('g')
                                .attr('transform', String.format('translate({0},{1})', - frame.daysWidth / 2 + 20, 0));

                            ChartsManager.renderImage(img,
                                'signs.hourglass',
                                ChartsManager.defaults.darkColor,
                                { width: 16, height: frame.height - 8, position:0 },
                                true);

                            var legendTitle = days.append('g')
                                .attr('transform', String.format('translate({0},{1})', 18 / 2, 0));

                            legendTitle.append('g')
                                .attr('class', 'legend-title')
                                .attr('transform', String.format('translate({0},{1})', 0, -1))
                                .append('text')
                                .text(d.duration_range.from + '-' + d.duration_range.to);

                            legendTitle.append('g')
                                .attr('class', 'legend-title2')
                                .attr('transform', String.format('translate({0},{1})', 0, 15))
                                .append('text')
                                .text('days');

                            // ransom
                            var ransom = g.append('g')
                                .attr('transform', String.format('translate({0},{1})', frame.daysWidth + frame.ransomWidth / 2, frame.height / 2));

                            var img2 = ransom.append('g')
                                .attr('transform', String.format('translate({0},{1})', - frame.ransomWidth / 2 + 54 / 2 + 5, 0));

                            ChartsManager.renderImage(img2,
                                'signs.funds',
                                ChartsManager.defaults.darkColor,
                                { width: 50, height: frame.height - 6, position: 0 },
                                true);

                            var legendTitle2 = ransom.append('g')
                                .attr('transform', String.format('translate({0},{1})', 54 / 2, 0));

                            legendTitle2.append('g')
                                .attr('class', 'legend-title')
                                .attr('transform', String.format('translate({0},{1})', 0, 1))
                                .append('text')
                                .text(scope.formatRansom(d.ransom_range.from) + '-' + scope.formatRansom(d.ransom_range.to));

                            legendTitle2.append('g')
                                .attr('class', 'legend-title2')
                                .attr('transform', String.format('translate({0},{1})', 0, 15))
                                .append('text')
                                .text('USD');


                            var pointerOut = g0.append('g');

                            // line
                            var points = [];
                            var startX = frame.x + frame.daysWidth;
                            var pointerWidth = 70;
                            var pointerMarginH = pointerWidth / 2;
                            var pointerMarginV = pointerWidth / 2 * 1.3;
                            var arrowRotateAngle = 90;
                            // first point
                            points.push({
                                x: startX,
                                y: frame.y + (frame.y > frame.point.y ? frame.height : 0)
                            });

                            if (startX + pointerMarginH <= frame.point.x) {
                                // only one intermediate point
                                points.push({
                                    x: startX,
                                    y: frame.point.y
                                });
                                // last point
                                points.push({
                                    x: frame.point.x - pointerMarginH,
                                    y: frame.point.y
                                });
                            } else if (startX - pointerMarginH >= frame.point.x) {
                                // only one intermediate point
                                points.push({
                                    x: startX,
                                    y: frame.point.y
                                });
                                // last point
                                points.push({
                                    x: frame.point.x + pointerMarginH,
                                    y: frame.point.y
                                });
                                arrowRotateAngle = 270;
                            } else {
                                var isUpBottom = frame.y < frame.point.y;
                                // two intermediate points
                                var intemediateDY = frame.point.y +
                                    pointerMarginV * (isUpBottom ? -1 : 1) -
                                    (frame.y + (isUpBottom ? frame.height : 0));
                                var intermediateY = frame.y + (isUpBottom ? frame.height : 0) + intemediateDY / 2;

                                points.push({
                                    x: startX,
                                    y: intermediateY
                                });
                                points.push({
                                    x: frame.point.x,
                                    y: intermediateY
                                });

                                // last point
                                points.push({
                                    x: frame.point.x,
                                    y: frame.point.y + pointerMarginV * (isUpBottom ? -1 : 1)
                                });
                                arrowRotateAngle = isUpBottom ? 180 : 0;
                            }

                            
                            var path = '';
                            _.each(points, function(p, i) {
                                    path += String.format('{0}{1},{2}', i === 0 ? 'M' : 'L', p.x, p.y);
                                });

                            var l = pointerOut.append('g')
                                .style('opacity', 0);
                            
                            l.append('path')
                                .attr('d', path)
                                .attr({
                                    stroke: ChartsManager.defaults.darkColor,
                                    'stroke-width': 2,
                                    'stroke-dasharray': '6,5',
                                    fill: 'none'
                                });
                            var lastPoint = points[points.length - 1];
                            var arrow = l.append('g')
                                .attr('transform', String.format('translate({0},{1})', lastPoint.x, lastPoint.y));
                            arrow.append('polygon')
                                .attr('points', '3.703,4.389 1.852,3.603 0,4.389 1.852,0')
                                .attr('fill', ChartsManager.defaults.darkColor)
                                .attr('transform', String.format('translate(-3.65, -3.65)' +
                                    ' scale(2)' +
                                    ' rotate({0}, 1.825, 1.825)', arrowRotateAngle));

                            // pointer

                            var pointer = pointerOut.append('g')
                                .attr('transform', String.format('translate({0},{1})', frame.point.x, frame.point.y));

                            var pointerIn = pointer.append('g')
                                .attr('transform', 'scale(0, 1)');

                            var pointerImg = pointerIn.append('g');
                            ChartsManager.renderImage(pointerImg,
                                'signs.location',
                                d.color,
                                { width: pointerWidth, height: pointerWidth * 1.5, position: 0 },
                                true);

                            var valueTitle = pointerIn.append('g')
                                .attr('class', 'value-title')
                                .append('text')
                                .text(d.value); 

                            // transitions
                            var barsDelay = 50 * 1;
                            var barRowsDelay = 8;
                            var barDuration = 300;

                            g.transition()
                                .remove();
                            g.transition()
                                .ease('quad-out')
                                .duration(barDuration * 2.5)
                                .delay(barsDelay * i)
                                .style('opacity', 1);

                            l.transition()
                                .remove();
                            l.transition()
                                .ease('quad-out')
                                .duration(barDuration * 2.5)
                                .delay(barsDelay * i)
                                .style('opacity', 1);

                            pointerIn.transition()
                                .remove();
                            pointerIn.transition()
                                .ease('cubic-out')
                                .duration(barDuration * .9)
                                .delay(barsDelay * i)
                                .attr('transform', 'scale(1, 1)');

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'regionsByKidnapDurationAndRansom.html'
            };

            return directive;
        }
    ]);
}());