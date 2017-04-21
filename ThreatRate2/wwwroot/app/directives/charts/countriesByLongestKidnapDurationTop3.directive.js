(function () {
    'use strict';

    var testModeGeneral = 0;

    angular.module('tr').directive('chartCountriesByLongestKidnapDurationTop3',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'repo.common',
        function (common, config, chartsHelper, $timeout, repoCountries) {

            var defaults = {
            };

            var colors = [
                '#6c1a12',
                '#8a281c',
                ChartsManager.defaults.frontColor
            ];

            var barsDelay = 125;
            var barRowsDelay = 8;
            var barDuration = 400;


            function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            }

            function describeArc(x, y, radius, startAngle, endAngle) {

                var start = polarToCartesian(x, y, radius, endAngle);
                var end = polarToCartesian(x, y, radius, startAngle);

                var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

                var d = [
                    "M", start.x, start.y,
                    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
                ].join(" ");

                return d;
            }

            function translateDonut(r, rIn) {
                return function (obj) {
                    return function (t) {
                        var dP = obj._data.percent * t;
                        var fromPrev = obj._data._prev ? obj._data._prev.to * t : 0;
                        return getPathByPercentage(obj._data.from + fromPrev, obj._data.from + fromPrev + dP, r, rIn);
                    }
                }
            }

            function getCenterPoint(x1, x2, y1, y2, radius) {
                var radsq = radius * radius;
                var q = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
                var x3 = (x1 + x2) / 2;


                var x = x3 + Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((y1 - y2) / q);



                var y3 = (y1 + y2) / 2;

                var y = y3 + Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((x2 - x1) / q);

                return { x: x, y: y };
            }


            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    testModeGeneral++;
                    if (testModeGeneral === 4) {
                        testModeGeneral = 0;
                    }

                    var testMode = 0;// testModeGeneral / 2 >= 1 ? 1 : 0;
                    var testMode2 = 0;// testModeGeneral % 2;

                    data = _.sortBy(data, 'value').reverse().slice(0, 3);
                    _.each(data, function(d, i) {
                        d.color = colors[i];
                    });

                    var container = element.find('[chart-body]');
                    container.html('');

                    var allCountries = repoCountries.allCountries();
                    var countriesRequested = _.map(allCountries, function(c) {
                        return 'countries.' + c[0];
                    });

                    var globe = ChartsManager.renderImage(container[0],
                        countriesRequested,
//                        ChartsManager.paths.countries.globe,
                        ChartsManager.defaults.darkColor,
                        null, false);

                    globe
                        .attr('transform', 'translate(0, 30)')
                        .style('opacity', 0);


                    var frame = {
                        width: container[0].offsetWidth,
                        height: container[0].offsetHeight
                    };

                    var globeFrame = {
                        scale: testMode === 0 ? 1 : 1.5
                    };

                    var boxGlobe = globe.node().getBBox();
                    globeFrame.width = boxGlobe.width * globeFrame.scale;
                    globeFrame.height = boxGlobe.height * globeFrame.scale;
                    globeFrame.x = (frame.width - globeFrame.width) / 2;
                    globeFrame.y = (frame.height - globeFrame.height) / 2
                        + (testMode === 0 ? 125 : 0);
                    globe.attr('transform', String.format('translate({0}, {1}) scale({2})',
                        globeFrame.x, globeFrame.y, globeFrame.scale));

                    var svg = d3.select($(globe[0]).parent('svg')[0]);

                    var gPointers = svg.append('g');
                    var gBlockBack = svg.append('g');
                    var gBlock = svg.append('g');
                    for (var i = 0; i < data.length && i < 3; i++) {
                        var d = data[i];

                        var dx = frame.width / 3 * (i + .5 + (i === 0 ? .1 : i === 2 ? -.1 : 0));
                        var dy = testMode === 0 ? frame.height / 4 : frame.height / 2;
                        // find existent country object
                        var country0 = globe.selectAll(String.format('[svg-icon="countries.{0}"]', d.name));
                        if (country0.node()) {
                            var countryFrame = {
                                expected: {
                                    width: 220,
                                    height: 220
                                },
                                initial: {}
                            };

                            var countryBack = d3.select(country0.node().cloneNode(true));
                            var country = d3.select(country0.node().cloneNode(true));
                            var gCountryBack = gBlockBack.append('g');
                            var gCountry = gBlock.append('g');
                            gCountryBack.node().appendChild(countryBack.node());
                            gCountry.node().appendChild(country.node());
                            var countryBox = country.node().getBBox();

                            if (countryBox.width) {

                                countryFrame.initial = {
                                    x: countryBox.x,
                                    y: countryBox.y,
                                    width: countryBox.width,
                                    height: countryBox.height
                                };

//                            country.attr('transform', String.format('translate({0}, {1})');
//                                country.selectAll('path').attr('fill', 'red');

                                var scaleX = countryFrame.expected.width / countryFrame.initial.width;
                                var scaleY = countryFrame.expected.height / countryFrame.initial.height;
                                var scale = scaleY > scaleX ? scaleX : scaleY;

                                countryFrame.width = countryFrame.initial.width * scale;
                                countryFrame.height = countryFrame.initial.height * scale;

                                countryFrame.x = -countryFrame.initial.x * scale -
                                    countryFrame.width / 2
                                    
//                                    + globeFrame.x
//                                    + countryFrame.expected.width / 2
                                    + dx;
                                countryFrame.y = -countryFrame.initial.y * scale -
                                    countryFrame.height / 2
//                                    + globeFrame.y
//                                    + countryFrame.expected.height / 4
                                    + dy;

                                gCountryBack.attr('transform',
                                    String.format('translate({0},{1}) scale({2})',
                                        globeFrame.x,
                                        globeFrame.y,
                                        globeFrame.scale))
                                    .style('opacity', 0);

                                gCountry.attr('transform',
                                    String.format('translate({0},{1}) scale({2})',
                                        globeFrame.x,
                                        globeFrame.y,
                                        globeFrame.scale))
                                    .style('opacity', 1);

                                var paths0 = countryBack.selectAll('path');
                                paths0.style('opacity', 0);
                                paths0.attr('fill', d.color);// ChartsManager.defaults.darkColor);

                                var paths = country.selectAll('path');
                                paths.style('opacity', 0);
                                paths.attr('fill', ChartsManager.defaults.secondaryBackColor);

                                /// pointers
                                var p = gPointers.append('g');
                                var arcPath = String.format("M{0},{1} A 500,500 0 0 0 {2},{3}",
                                    countryFrame.initial.x * globeFrame.scale + countryFrame.initial.width / 2 * globeFrame.scale + globeFrame.x,
                                    countryFrame.initial.y * globeFrame.scale + countryFrame.initial.height / 2 * globeFrame.scale + globeFrame.y,
                                    countryFrame.initial.x * globeFrame.scale + countryFrame.initial.width / 2 * globeFrame.scale + globeFrame.x,
                                    countryFrame.initial.y * globeFrame.scale + countryFrame.initial.height / 2 * globeFrame.scale + globeFrame.y);       // Arc details...
//                                var arcPath = "M{0},{1} A 500,500 1 1 0 ' : ' 0 0 0 ') : " 0 " + big + " 1 ") +       // Arc details...

                                arcPath = String.format("M{0},{1} A 500,500 0 0 0 {2},{3}",
                                    countryFrame.initial.x * globeFrame.scale + countryFrame.initial.width / 2 * globeFrame.scale + globeFrame.x,
                                    countryFrame.initial.y * globeFrame.scale + countryFrame.initial.height / 2 * globeFrame.scale + globeFrame.y,
                                    dx + countryFrame.expected.width / 2 * 0,
                                    dy + countryFrame.expected.height / 2 * 0);       // Arc details...
                                var arc = p.append('path')
                                    .attr('d', arcPath)
                                    .attr({
                                        stroke: d.color,
                                        'stroke-width': 1.5,
                                        'stroke-dasharray': '6,5',
                                        fill: 'none'
                                    }).style('opacity', 0);
                                

                                /// animations

//                                gCountry.transition()
//                                    .remove();
//                                gCountry.transition()
//                                    .ease('linear')
//                                    .duration(barDuration)
//                                    .delay(barDuration * 2)
//                                    .style('opacity', 1);

                                gCountryBack.transition()
                                    .ease('cubic-out')
                                    .duration(barDuration * 1.8)
                                    .delay(barDuration)
                                    .style('opacity', 1);

                                gCountry.transition()
                                    .ease('quad-out')
                                    .duration(barDuration * 1.8)
                                    .delay(i * barsDelay + barDuration * 2)
                                    .attr('transform',
                                    String.format('translate({0},{1}) scale({2})',
                                       countryFrame.x,
                                       countryFrame.y,
                                        scale));
//
                                arc.transition()
                                    .remove();
                                arc.transition()
                                    .ease('linear')
                                    .duration(barDuration)
                                    .delay(barDuration * 4)
//                                    .attr('d', arcPath)
                                    .style('opacity', testMode2 === 0 ? 1 : 0);

                                paths0.transition()
                                    .remove();
                                paths0.transition()
                                    .ease('linear')
                                    .duration(barDuration)
                                    .delay(barDuration)
                                    .style('opacity', 1);

                                paths.transition()
                                    .remove();
                                paths.transition()
                                    .ease('linear')
                                    .duration(barDuration)
                                    .delay(0)
                                    .style('opacity', 1);
                                paths.transition()
                                    .ease('linear')
                                    .duration(barDuration * 2.5)
                                    .delay(barDuration)
//                                    .style('opacity', 1)
                                    .attr('fill', d.color);
                            }
                        }

                        var g = gBlock.append('g');
                        g.attr('transform', String.format('translate({0},{1})', dx - 30, dy))
                            .style('opacity', 0);

                        g.transition()
                            .remove();
                        g.transition()
                            .ease('cubic-out')
                            .duration(barDuration * 1.5)
                            .delay(i * barsDelay + barDuration * 4)
                            .attr('transform', String.format('translate({0},{1})', dx, dy))
                            .style('opacity', 1);

//                        ChartsManager.renderImage(g,
//                            'countries.' + d.name,
//                            ChartsManager.defaults.frontColor,
//                            { width: 250, height: 250, position: 0 }, true);

/*
                        var clock = g.append('g')
                            .attr('transform', 'translate(0, 30)');

                        clock.append('circle')
                            .attr({
                                r: 23,
                                fill: d.color
//                                fill: ChartsManager.defaults.frontColor
                            });

                        ChartsManager.renderImage(clock,
                            ChartsManager.paths.signs.clock, '#fff',
                            { width: 40, height: 40, position: 0, dy: 0 }, true);
*/

                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, -30)')
                            .append('text')
                            .text(d.value + ' days')
                            .attr({ stroke: d.color, 'stroke-width': 8, 'stroke-linejoin': 'round' });
//                            .attr({ stroke: ChartsManager.defaults.frontColor, 'stroke-width' : 8 });
                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, -30)')
                            .append('text')
                            .text(d.value + ' days');
                            
                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, 0)')
                            .append('text')
                            .text(d.title)
                            .attr({ stroke: d.color, 'stroke-width': 6, 'stroke-linejoin': 'round'});
//                            .attr({ stroke: ChartsManager.defaults.frontColor, 'stroke-width': 6 });
                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, 0)')
                            .append('text')
                            .text(d.title);
                    }

                    globe.transition()
                        .remove();
                    globe.transition()
                        .ease('linear')
                        .duration(barDuration * .75)
                        .delay(0)
                        .style('opacity', .65);

                    globe.transition()
                        .ease('linear')
                        .duration(barDuration * 2.5)
                        .delay(barDuration * .75)
                        .style('opacity', .25);

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