(function () {
    'use strict';


    angular.module('tr').directive('chartKidnapResults',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'colorsService',
        function (common, config, chartsHelper, $timeout, colorsService) {

            var defaults = {
            };

            var colors = colorsService.getSchema(colorsService.schemas.fixed4).reverse();

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {
                    var data = scope.data;

                    if (!data) {
                        return;
                    }

                    data = _.sortBy(data, 'year').reverse();

//                    var maxValue = _.max(_.map(data, function(el) { return el.value; })); // to have space for the top icon and title

                    scope.top = data[0];
                    var rows = [];
                    scope.rows = rows;
                    for (var j = 0; j < 2; j++) {
                        var row = { columns: [] };
                        rows.push(row);
                        for (var k = 0; k < 2; k++) {
                            var column;
                            var n = (j * 2) + k + 1;
                            if (n < data.length) {
                                column = data[n];
                            } else {
                                column = {};
                            }
                            row.columns.push(column);
                        }
                    }
//                    var secondaryData = data.slice(data.length - 4);
                    $timeout(function() {

                        var main = element.find('[chart-body="main"]');
                        var containers = element.find('[chart-body="secondary"]');

                        _.each(data, function(group, i) {
                                var container = i === 0 ? main : $(containers[i - 1]);
                                container.html('');

                                var barData = data[i];

                                _.each(barData.data,
                                    function(d, i) {
                                        d.color = colors[i];
                                    });

                            var _r = i === 0 ? 110 : 70;
                            var options = { bars: {} };
                                options.bars.radius = _r;
                                options.bars.radiusOuter = 4 / 54 * _r;
                                options.bars.radiusInner = 16 / 54 * _r;
                                options.tooltip = {};
//                                options.tooltip.className = 'extended';

                                var ch = new chartBoxDonutV1({
                                    data: barData.data,
                                    container: container[0],
                                    options: options
                                });

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/kidnapResults.html'
            };

            return directive;
        }
    ]);
}());