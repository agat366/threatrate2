(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByForeignersVsLocalsKidnapTop5',
    [
        'common', 'config', 'chartsHelper', 'colorsService',
        function (common, config, chartsHelper, colorsService) {

            var defaults = {
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    var foreign = {
                         data: _.sortBy(data.foreign, 'value').slice(data.length - 5).reverse()
                    };
                    scope.foreign = foreign.data;

                    var local = {
                        data: _.sortBy(data.local, 'value').slice(data.length - 5).reverse()
                    };
                    scope.local = local.data;

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    foreign.total = _.reduce(_.map(foreign.data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);
                    local.total= _.reduce(_.map(local.data, function (el) { return el.value; }),
                        function (memo, num) { return memo + num; }, 0);

                    var maxValue = _.max([
                        _.max(_.map(foreign.data, function(d) { return d.value; })),
                        _.max(_.map(local.data, function(d) { return d.value; }))
                    ]);

                    _.each([foreign, local],
                        function(it, i) {
                            for (var j = 0; j < it.data.length; j++) {
                                var d = it.data[j];

                                var color = colorsService.getColor(colorsService.schemas.levels4, d.value, maxValue);

                                d.valueTitle = d.value;
                                d.value2Title = (Math.round(d.value / it.total * 1000) / 10) + '%';
                                d.color = color,
                                d.icon = null;
//                                d.titleColor = d.color;

                                d.value = i === 0 ? d.value : (maxValue - d.value);

                            }

                            var options = {
                                
                                layout: {
                                    rows: {
                                        count: 3,
                                        dy: i === 0 ? 0 : 65
                                    },
                                    columns: null,
                                    padding: {
                                        top: 3,
                                        bottom: 70,
                                        left: -50,
                                        right: -50
                                    }
                                },
                                bars: {
                                    graph: {
                                        dy: i === 0 ? 0 : -65
                                    },
                                    maxValue: maxValue,
                                    maxValueRangeMultiplier: 1.55,
                                    pointMaskRadius: 80,
                                    icon: {
                                        name: i === 0 ? 'signs.foreigner' : 'signs.local',
                                        height: 25,
                                        dx: -5,
                                        dy: i === 0 ? -15 : 67,
                                        scale: 1.25
                                    },
                                    value: {
                                        dy: i === 0 ? 0 : -38
                                    },
                                    value2: {
                                        dy: i === 0 ? 0 : -78
                                    },
                                    legend: {
                                        icon: null,

                                        height: 0
                                    }
                                },
                                animation: {
                                    barDelay: 20
                                }
                            };
                            var ch = new chartGridVertical({
                                data: it.data,
                                container: chartsContainer[i],
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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByForeignersVsLocalsKidnapTop5.html'
            };

            return directive;
        }
    ]);
}());