(function(angular) {
    'use strict';


    var app = angular.module('tr',
        [
            'ngResource',
            'ngAnimate',
            'angular-extend-promises'
        ]);

    var config = {
        liveData: false,
        routeUrl: '',
        chartDirectivesPath: '/app/directives/charts'
    };

    app.value('config', config);

    app.config([
        function () {

        }
    ]);

    app.run([
            '$rootScope',
            function($rootScope) {
                
            }
        ]);
}(angular));