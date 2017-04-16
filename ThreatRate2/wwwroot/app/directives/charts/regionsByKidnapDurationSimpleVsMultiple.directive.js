﻿(function () {
    'use strict';


    angular.module('tr').directive('chartRegionsByKidnapDurationSimpleVsMultiple',
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
                        '#8fd5e3',
                        '#45abb6',
                        '#296886',
                        '#c1c1c1',
                        '#e1482c',
                        '#bc3d28'
                    ];

                    var single = [];
                    var multi = [];

                    _.each(data,
                        function(d) {
                            single.push({
                                name: d.name,
                                title: d.title,
                                value: d.duration,
                                ransom_range: d.ransom_range,
                                duration_range: d.duration_range
                            });
                            multi.push({
                                name: d.name,
                                title: d.title,
                                value: d.multi_duration,
                                ransom_range: d.multi_ransom_range,
                                duration_range: d.multi_duration_range
                            });
                        });

                    scope.regionsSingle = single;
                    scope.regionsMulti = multi;

                    var single_sorted = _.sortBy(single, 'value');
                    var multi_sorted = _.sortBy(multi, 'value');

                    _.each(colors, function(c, i) {
                            single_sorted[i].color = c;
                            multi_sorted[i].color = c;
                        });

                    var maxValueSingle = _.max(_.map(single, function (el) { return el.value; }));
                    var maxValueMulti = _.max(_.map(multi, function (el) { return el.value; }));

                    // levels
                    var maps = element.find('[chart-body="map"]');
                    maps.html('');
                    var charts = element.find('[chart-body="data"]');
                    charts.html('');

                    var genericData = [single, multi];

                    var barsDelay = 100;
                    var barRowsDelay = 8;
                    var barDuration = 700;

                    _.each(maps, function (map, i) {
                        var regions = _.map(genericData[i],
                            function(r) {
                                return {
                                    name: 'regions.' + r.name,
                                    color: r.color,
                                    value: r.value, 
                                    title: r.title
                                };
                            });

                        var orderedRegions = _.sortBy(regions, 'value');
                        _.each(orderedRegions, function (r, i) {
                            r.__order = i;
                        });

                        var regionContainer = ChartsManager.renderImage(map, regions, null, -1);
                        var icons = regionContainer.selectAll('[svg-icon]')[0];
                        _.each(icons, function (ic, j) {
                            var cont = d3.select(ic);
                            var regionName = cont.attr('svg-icon');
                            var region = _.find(regions, { name: regionName });
                            var paths = cont.selectAll('path')[0];

                            _.each(paths, function (path, k) {
                                path = d3.select(path);
                                var finalFill = path.attr('fill');
                                if (finalFill) {
                                    path.style('opacity', 1);
                                    path.attr('fill', '#fff');

                                    path.transition()
                                        .remove();
                                    path.transition()
                                        .ease('quad-out')
                                        .duration(500)
                                        .delay(barsDelay)
                                        .attr('fill', ChartsManager.defaults.darkColor)
                                        .style('opacity', .85)
                                        ;

                                    path.transition()
                                        .ease('quad-out')
                                        .duration(barDuration * 1.25)
                                        .delay(region.__order * barsDelay * 1.25 * 0 + 550)
                                        .attr('fill', finalFill)
                                        .style('opacity', 1)
                                        ;

                                }
                            });
                        });
                    });


                    _.each(charts, function(chart, i) {

                            var regions = _.map(genericData[i],
                                function(r) {
                                    return {
//                                        name: 'regions.' + r.name,
                                        color: r.color,
                                        value: r.value,
                                        title: r.title
                                    };
                                });

                            var options = {
                            bars: {
                                maxValue: i === 0 ? maxValueSingle : maxValueMulti,
                                maxValueRangeMultiplier: 1
  
                            },
                            layout: { // todo: custom charts. needs to be changed to move bars out of layout
                                rightDirection: i === 0 ? false : true,
                                bars: {
                                    title: {
                                        width: 50,
                                    },
                                    bar: {
                                        width: 140,
                                        height: 22,
                                        margin: {
                                            left: 12,
                                            right: 12
                                        },
                                        background: ChartsManager.defaults.backColor

                                    },
                                    value: {
                                        width: 0
                                    },
                                    value2: {
                                        width: 0
                                    }
                                },
                            
                        }/*
                            layout: {
                                padding: {
                                    top: 20,
                                    left: 5,
                                    right: 5,
                                    bottom: 0
                                }
                            }
*/
                        };
                            var ch = new chartBoxLinearHorizontal({
                                data: regions,
                                container: chart,
                                options: options
                            });
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/regionsByKidnapDurationSimpleVsMultiple.html'
            };

            return directive;
        }
    ]);
}());