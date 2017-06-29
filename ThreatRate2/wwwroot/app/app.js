(function(angular) {
    'use strict';

    var app;
    var config = {
        routeUrl: '',
        chartDirectivesPath: '/app/directives/charts/'
    };

    var ruby = window.rubyEngine;
    if (ruby) {
        app = angular.module('tr',
        [
            'ngResource',
            'ngAnimate',
            'angular-extend-promises',
            'templates'
        ]);

        if (ruby.config) {
            config.chartDirectivesPath = ruby.config.directivesPath;
            config.apiRootUrl = ruby.config.apiRootUrl;
            config.redirectOnUnathorized = ruby.config.redirectOnUnathorized;
        }
    } else {
        app = angular.module('tr',
        [
            'ngResource',
            'ngAnimate',
            'angular-extend-promises'
        ]);
    }

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

    app.filter('years', function() {
        'use strict';

        return function(input) {
            return input <= 1 ? '1 year' : (input + ' years');
        };
    });
}(angular));