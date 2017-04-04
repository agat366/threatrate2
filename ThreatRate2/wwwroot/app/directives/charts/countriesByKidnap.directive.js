(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnap',
    [
        'common', 'config', 'chartsHelper',
        function (common, config, chartsHelper) {

            var defaults = {
                columns: 6,
                rows: 31,
                levelPoints: 5
            };

            function link(scope, element, attributes) {

                scope.$watch('data', bindData);

                function bindData() {

                    var data = _.sortBy(scope.data, 'value').reverse();
                    if (!data) {
                        return;
                    }

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                    scope.columns = [];
                    for (var i = 0; i < defaults.columns; i++) {
                        var column = { items: [] };
                        scope.columns.push(column);

                        for (var j = 0; j < defaults.rows; j++) {
                            var n = i * defaults.rows + j;
                            var d;
                            if (n < data.length) {
                                d = data[n];
                            } else {
                                d = {};
                            }

                            d.levels = [];
                            var level = d.value / maxValue * defaults.levelPoints;
                            for (var k = 0; k < defaults.levelPoints; k++) {
                                d.levels.push({ active: k <= level });
                            }

                            column.items.push(d);
                        }
                    }
                }
            }



            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByKidnap.html'
            };

            return directive;
           
        }
    ]);
}());