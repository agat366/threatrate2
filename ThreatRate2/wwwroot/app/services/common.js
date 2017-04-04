(function () {
    'use strict';
    var serviceId = 'common';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q',
            function ($q) {


                return {
                    $q: $q
                }
            }
        ]);
}());