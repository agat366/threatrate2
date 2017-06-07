(function () {
    'use strict';


    angular.module('tr').directive('chartIcon',
    [
        'common', 'config', 'chartsHelper',
        function (common, config, chartsHelper) {


            function link(scope, element, attributes) {

                var scale = parseInt(attributes.iconScale);

                ChartsManager.renderImage(element[0],
                    attributes.iconName,
                    attributes.iconColor,
                    isNaN(scale) ? -1 : scale, true);
            }

            var directive = {
                link: link,
                restrict: 'A',
                replace: true,
                scope: {
                    data: '='
                }

//                templateUrl: config.routeUrl + config.chartDirectivesPath + 'ageGroupsByKidnap.html'
            };

            return directive;
        }
    ]);
}());