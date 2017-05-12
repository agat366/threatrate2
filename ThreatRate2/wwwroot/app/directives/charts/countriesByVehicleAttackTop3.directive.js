(function () {
    'use strict';

    var testModeGeneral = 0;

    angular.module('tr').directive('chartCountriesByVehicleAttackTop3',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'repo.common', 'colorsService',
        function (common, config, chartsHelper, $timeout, repoCountries, colorsService) {

            var defaults = {
            };

            var barsDelay = 125;
            var barRowsDelay = 8;
            var barDuration = 400;


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
                    var testMode2 = 0;//testModeGeneral % 2;

                    data = _.sortBy(data, 'value').reverse().slice(0, 3);
                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                    _.each(data, function (d, i) {
                        var color = colorsService.getColor(colorsService.schemas.levels3, d.value, maxValue);
                        d.color = color;
                    });

                    var container = element.find('[chart-body]');
                    container.html('');

                    var allCountries = repoCountries.allCountries();
                    var countriesRequested = _.map(allCountries, function (c) {
                        return 'countries.' + c.name;
                    });
//                    countriesRequested.push('countries.136.v2');
//                    countriesRequested.push('countries.40.v2');
//                    countriesRequested.push('countries.99.v2');
//                    countriesRequested.push('countries.3.v2');

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

//                        d.name = i === 0 ? '99.v2' : i === 1 ? '40.v2' : '3.v2';
//                        d.title = i === 0 ? 'Japan' : i === 1 ? 'Mexico' : 'Afghanistan';

                        var dx = frame.width / 3 * (i + .5 + (i === 0 ? .1 : i === 2 ? -.1 : 0));
                        var dy = testMode === 0 ? (frame.height / 4 + 25) : frame.height / 2;
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
                            .delay(i * barsDelay * .95 + barDuration * 2.85)
                            .attr('transform', String.format('translate({0},{1})', dx, dy))
                            .style('opacity', 1);

                        //                        ChartsManager.renderImage(g,
                        //                            'countries.' + d.name,
                        //                            ChartsManager.defaults.frontColor,
                        //                            { width: 250, height: 250, position: 0 }, true);

                        if (true) {
                            g.append('g')
                                .attr('class', 'value-title')
                                .attr('transform', 'translate(0, -140)')
                                .append('text')
                                .text(d.value)
                                .attr({
                                    stroke: '#fff',
                                    'stroke-width': 4, 'stroke-linejoin': 'round'
                                });
                            
                        }                        //                            .attr({ stroke: ChartsManager.defaults.frontColor, 'stroke-width' : 8 });
                        g.append('g')
                            .attr('class', 'value-title')
                            .attr('transform', 'translate(0, -140)')
                            .append('text')
                            .style('fill', testMode2 === 0 ? d.color : ChartsManager.defaults.darkColor)
                            .text(d.value);

                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, -115)')
                            .append('text')
                            .text(d.title)
                            .attr({ stroke: '#fff', 'stroke-width': 6, 'stroke-linejoin': 'round' });

                        g.append('g')
                            .attr('class', 'legend-title')
                            .attr('transform', 'translate(0, -115)')
                            .append('text')
                            .text(d.title)
                            .attr('fill', d.color)
                            .style('fill', d.color);
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByVehicleAttackTop3.html'
            };

            return directive;
        }
    ]);
}());