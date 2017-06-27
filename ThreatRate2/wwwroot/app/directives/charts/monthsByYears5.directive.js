(function () {
    'use strict';


    angular.module('tr').directive('chartMonthsByYears5',
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

//                    scope.total = _.reduce(_.map(data, function (el) { return el.value; }),
//                        function (memo, num) { return memo + num; }, 0);

                    var monthId = scope.monthId() || 1;

                    var chartsContainer = element.find('[chart-body]');
                    chartsContainer.html('');

                    data = _.orderBy(data, 'year').reverse();

                    var preparedData = _.map(data,
                        function (year) {
                            var sortMonths = _.sortBy(year.data, 'value');
                            var max = sortMonths[sortMonths.length - 1];
                            var min = sortMonths[0];
                            var requiredMonth = year.data[monthId];
                            return {
                                year: year.year,
                                title: year.year,
                                data: [
                                    {
                                        value: requiredMonth.value,
                                        color: colorsService.getColor(colorsService.schemas.medium),
                                        legendColor: ChartsManager.defaults.secondaryBackColor,
                                        title: requiredMonth.title
                                    },
                                    {
                                        value: min.value,
                                        color: colorsService.getColor(colorsService.schemas.veryLow),
                                        legendColor: ChartsManager.defaults.blueColor,
                                        title: min.title
                                    },
                                    {
                                        value: max.value,
                                        color: colorsService.getColor(colorsService.schemas.high),
                                        legendColor: ChartsManager.defaults.frontColor,
                                        textColor: '#fff',
                                        title: max.title
                                    }
                                ]
                            }
                        });

                    var svg = ChartsManager.renderImage(chartsContainer, null);
                    var frameContainer = { w: chartsContainer[0].offsetWidth, h: chartsContainer[0].offsetHeight };

                    var maxValue = _.max(_.map(preparedData, function(d) {
                            return d.data[2].value;
                        }));

                    var grid = svg.append('g');
                    var dx = frameContainer.w / preparedData.length;
                    var barMarginWidth = 10;
                        var frame = {
                            w: dx,
                            h: frameContainer.h - 50,
                            legend: {
                                height: 60,
                                title: {
                                    height: 20
                                }
                            },
                            icon: {
                                height: 40
                            },
                            padding: {
                                left: 4,
                                right: 4,
                                top: 30,
                                bottom: 0
                            }
                        };
                        frame.inner = {
                            w: frame.w - frame.padding.left - frame.padding.right,
                            h: frame.h
                        };

                    _.each(preparedData,
                        function (d, i) {


                            var g = svg.append('g')
                                .attr('transform', String.format('translate({0},{1})', dx * i, 0));

                            var bar = g.append('g')
                                .attr('transform', String.format('translate({0},{1})', frame.padding.left, frame.padding.top));


                            var options = {
                                bars: {
                                    maxValue: maxValue,
        //                            maxValueRangeMultiplier: 1,

                                    title: {
                                        height: 30,
                                        useRoundBorders: false,
                                            icon: {
                                                name: ChartsManager.paths.signs.person,
                                                color: ChartsManager.defaults.darkColor
                                            }
                                        },
        //                                topIcon: {
        //                                    dy: -40
        //                                },
                                    margin: {
        //                                    top: 50,
                                            right: barMarginWidth,
                                            left: barMarginWidth
                                        }
                                },
                                layout: {
                                    width: frame.inner.w,
                                    height: frame.inner.h,
                                    padding: {
                                        top: 140,
                                        left: 0,
                                        bottom: frame.legend.height,
                                        right: 0
                                    }
                                },
                                animation: {
                                    delay: i * 50
                                }

                            };

                            var ch = new chartBubbledLines({
                                data: d.data,
                                container: bar,
                                options: options
                            });



                            // legend
                            var legend = g.append('g')
                                .attr('transform', String.format('translate({0},{1})', dx / 2, frameContainer.h - frame.legend.height));

                            _.each(d.data,
                                function (m, i) {
                                    if (i === 0) {
                                        // first column
                                        return;
                                    }

                                    var legendContainer = legend.append('g')
                                        .attr('class', 'value-hint')
                                        .attr('transform', String.format('translate({0},{1})',
                                            frame.w / 3 * (i + .5) - frame.w / 2,
                                            (frame.legend.height - frame.legend.title.height) / 2 - 13));

                                    legendContainer
                                        .append('text')
                                        .text((i == 0 ? '' : i == 1 ? 'Lowest' : 'Highest') + ' K&R')
                                        .attr('transform', String.format('translate(0,-13)'));

                                    legendContainer
                                        .append('text')
                                        .text('month for');

                                    legendContainer
                                        .append('text')
                                        .text('the ' + d.year)
                                        .attr('transform', String.format('translate(0,13)'));
                                    // todo: year to pass from controller
                                });
                            legend.append('g')
                                .attr('class', 'legend2-title')
                                .attr('transform', String.format('translate({0},{1})', 0, frame.legend.height - frame.legend.title.height / 2))
                                .append('text')
                                .text(d.title);

                            // lines
                            if (i < preparedData.length - 1) {
                                grid.append('line')
                                    .attr({
                                        x1: dx * (i + 1),
                                        x2: dx * (i + 1),
                                        y1: i === 0 ? 0 : (frame.padding.top + 12),
                                        y2: frameContainer.h,
                                        stroke: i === 0
                                            ? ChartsManager.defaults.darkColor
                                            : ChartsManager.defaults.secondaryBackColor,
                                        'stroke-width': 2,
                                        'stroke-dasharray': '6,5'
                                    });
                                
                            }

                        });

                    // top groups
                    var groups = grid.append('g');
                    var currentYear = groups.append('g');
                    currentYear.append('line')
                        .attr({
                            x1: barMarginWidth,
                            x2: dx - barMarginWidth,
                            y1: frame.padding.top,
                            y2: frame.padding.top,
                            stroke: ChartsManager.defaults.secondaryBackColor,
                            'stroke-width': 2,
                            'stroke-dasharray': '6,5'
                        });
                    currentYear.append('g')
                        .attr('class', 'legend2-title')
                        .attr('transform', String.format('translate({0},{1})', dx / 2, frame.padding.top / 2))
                        .append('text')
                        .text('Current Year');

                    var otherYears = groups.append('g');
                    otherYears.append('line')
                        .attr({
                            x1: dx + barMarginWidth,
                            x2: dx * (preparedData.length) - barMarginWidth,
                            y1: frame.padding.top,
                            y2: frame.padding.top,
                            stroke: ChartsManager.defaults.secondaryBackColor,
                            'stroke-width': 2,
                            'stroke-dasharray': '6,5'
                        });
                    otherYears.append('g')
                        .attr('class', 'legend2-title')
                        .attr('transform', String.format('translate({0},{1})', dx * (1 + (preparedData.length - 1) / 2), frame.padding.top / 2))
                        .append('text')
                        .text('Historical Year');


                }
            }

            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '=',
                    year: '=',
                    monthId: '&'
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'monthsByYears5.html'
            };

            return directive;
        }
    ]);
}());