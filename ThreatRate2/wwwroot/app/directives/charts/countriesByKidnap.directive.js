(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesByKidnap',
    [
        'common', 'config', 'chartsHelper', 'repo.common', '$timeout',
        function (common, config, chartsHelper, repo, $timeout) {

            var defaults = {
                columns: 6,
                rows: 31,
                levelPoints: 5
            };

            function link(scope, element, attributes) {

                scope.$watch('data', function() {
                    scope.isLoaded = false;
                    $timeout(bindData, 50);
                });

                function bindData() {

                    var data = _.sortBy(scope.data, 'value').reverse();
                    if (!data || !data.length) {
                        return;
                    }

                    scope.columns = null;

                    var maxValue = _.max(_.map(data, function (el) { return el.value; }));

                    var allCountries = repo.allCountries();
                    var notExistent = _.filter(allCountries, function(c) {
                        return !_.find(data, function(d) {
                            return d.name == c.name;
                        });
                    });
                    var itemsCount = defaults.columns * defaults.rows;
                    for (var l = 0; l < notExistent.length && l < itemsCount; l++) {
                        var d = notExistent[l];
                        var levels = [];
                        for (var m = 0; m < defaults.levelPoints; m++) {
                            levels.push({});
                        }
                        data.push({
                            title: d.title,
                            levels: levels,
                            isEmpty: true
                        });
                    }
                    
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
                                var state = {
                                    active: position <= level,
                                };
                                console.log(d.value / maxValue)
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
                    $timeout(function() {
                        scope.isLoaded = true;
                    }, 100);
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