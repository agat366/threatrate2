(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapWithLocationsTop10',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'repo.common', 'colorsService',
        function (common, config, chartsHelper, $timeout, countriesRepo, colorsService) {

            var defaults = {
                columns: 2,
                rows: 5,
                levelPoints: 12
            };

            var countries;

            function link(scope, element, attributes) {

                countries = countriesRepo.allCountries();

                scope.titleByName = function (item) {
                    var name = item.name;
                    var country = _.find(countries,
                        function (c) {
                            return c.name === name;
                        });
                    if (country) {
                        return country.title.replace(/\s/gi, '-');
                    }
                };

                scope.$watch('data',
                    function() {
                        if (!scope.data) {
                            return;
                        }

                        scope.isLoaded = false;
                        $timeout(bindData, 0);
                    });


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

                            var color = colorsService.getColor(colorsService.schemas.levels6, d.value, maxValue);

                            d.color = color;
                            column.items.push(d);
                        }
                    }

                    $timeout(function() { scope.isLoaded = true; }, 0);
                }
            }



            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + 'countriesByKidnapWithLocationsTop10.html'
            };

            return directive;
           
        }
    ]);
}());