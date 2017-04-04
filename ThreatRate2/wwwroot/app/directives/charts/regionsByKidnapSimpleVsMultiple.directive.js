(function () {
    'use strict';


    angular.module('tr').directive('chartRegionsByKidnapSimpleVsMultiple',
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
                                value: d.single
                            });
                            multi.push({
                                name: d.name,
                                title: d.title,
                                value: d.multi
                            });
                        });
                    single = _.sortBy(single, 'value');
                    multi = _.sortBy(multi, 'value');

                    _.each(colors, function(c, i) {
                            single[i].color = c;
                            multi[i].color = c;
                        });

                    var maxValueSingle = _.max(_.map(single, function (el) { return el.value; }));
                    var maxValueMulti = _.max(_.map(multi, function (el) { return el.value; }));

                    // levels
                    var maps = element.find('[chart-body="map"]');
                    maps.html('');
                    var charts = element.find('[chart-body="data"]');
                    charts.html('');

                    var genericData = [single, multi];

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
                        ChartsManager.renderImage(map, regions, null, -1);
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
                            layout: { // todo: custom charts. needs to be changed to move bars out of layout
                            bars: {
                                bar: {
                                    width: 25,
                                    height: 160,
                                    margin: {
                                        left: 12,
                                        right: 12
                                    },
                                    background: ChartsManager.defaults.backColor

                                },
                                value: {
                                    height: 40
                                },
                                value2: {
                                    height: 10
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
                            var ch = new chartBoxLinearVertical({
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/regionsByKidnapSimpleVsMultiple.html'
            };

            return directive;
        }
    ]);
}());