(function () {
    'use strict';

    var serviceId = 'data';
    var apiRootUrl = 'api';
    angular.module('tr').factory(serviceId,
    [
        '$resource', 'common', 'config',
        function ($resource, common, config) {
            var authHeader = 'Token token="7oTPPfWQK07DRH+ugRK32p+8e6nLWs/fLUfjPrjGomoxvLMOhh/ETUuLjsB3Qul81c1dYnlfc/6T0a0aZHfTDA==", email="notifications@github.com"';

        var resource = $resource(apiRootUrl + '/:controller/:action/:id/:id2',
            { action: '@action', controller: '@controller' },
            { 'put': { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: authHeader } } },
            { 'get': { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: authHeader } } },
            { 'post': { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authHeader } } },
            { 'delete': { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: authHeader } } }
            );

        var $q = common.$q;

        function processContextAction() {
            var resourceMethod = arguments[0];
            var settings = arguments[1];
            var requestParams = arguments[2];
            var data = arguments[3];

            var params = [];

            var action = typeof (requestParams) === 'string'
                ? { action: requestParams }
                : requestParams;

            action.controller = action.controller || settings.controller;
            
            var def = $q.defer();

            params.push(action);
            if(data)
                params.push(data);


            resourceMethod.apply(resource, params)
                .$promise
                .then(function(response) {
                        def.resolve(response.result);
                    },
                    function(response) {
                        processRequestError(response);
                        def.reject(response);
                    });

            if (config.liveData === false) {
//                def.reject({});
            }

            return def.promise;
        }

        function processRequestError(error) {
            console.log(error);
        }


        var context = function(settings) {
            var result = {
                save: function() {
                    var params = [resource.save, settings || {}];
                    params.push.apply(params, arguments);
                    return processContextAction.apply(this, params);
                },
                get: function() {
                    var params = [resource.get, settings];
                    var requestDataParams = arguments[1] || {};
                    requestDataParams.action = arguments[0];
//                    $.extend(requestDataParams, settings);
                    params.push(requestDataParams);
                    return processContextAction.apply(this, params);
                }
            };

            return result;
        };

        var service = {
            resource: resource,
            context: context
        };

        function init() {

        }

        init();

        return service;
    }]);
}());
