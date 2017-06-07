(function () {
    'use strict';


    angular.module('tr').directive('chartCountriesTest',
    [
        'common', 'config', 'chartsHelper', '$timeout', 'repo.common',
        function (common, config, chartsHelper, $timeout, repo) {

            var defaults = {
            };

            var colors = [
                '#8fd5e3',
                '#45abb6',
                '#296886',
                '#c1c1c1',
                '#e1482c',
                '#bc3d28'
            ].reverse();

            function link(scope, element, attributes) {

                var countries = repo.allCountries();

                scope.countries = countries;
            }
            
            var directive = {
                link: link,
                restrict: 'E',
                replace: true,
                scope: {
                    data: '='
                },
                templateUrl: config.routeUrl + config.chartDirectivesPath + '_countriesTest.html'
            };

            return directive;
        }
    ]);
}());