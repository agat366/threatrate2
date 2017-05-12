(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnapTop30',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'repo.common',
        function (common, config, chartsHelper, $timeout, countriesRepo) {

            var defaults = {
                columns: 2,
                rows: 15,
                levelPoints: 12
            };

            var countries;

            function link(scope, element, attributes) {

                countries = countriesRepo.allCountries();

                scope.titleByName = function (item) {
                    var name = item.name;
                    var country = _.find(countries,
                        function(c) {
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
                            var level = d.value / maxValue;
                            for (var k = 0; k < defaults.levelPoints; k++) {
                                var position = k / defaults.levelPoints;
                                var state = { active: position <= level };
                                //                                console.log(d.value / maxValue)
                                var nextIsActive = k + 1 < defaults.levelPoints
                                    && (k + 1) / defaults.levelPoints <= level;
                                state.halfActive = state.active
                                    && (position + (1 / defaults.levelPoints / 2) > level)
                                    && !nextIsActive;

                                d.levels.push(state);
                            }

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
                templateUrl: config.routeUrl + config.chartDirectivesPath + '/countriesByKidnapTop30.html'
            };

            return directive;
           
        }
    ]);
}());