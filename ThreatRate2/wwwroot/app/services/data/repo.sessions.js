(function () {
    'use strict';
    var serviceId = 'repo.sessions';
    angular
        .module('tr')
        .service(serviceId,
        [
            'data', 'common',
            function(dataContext, common) {

                var context = dataContext.context({
                    controller: 'v1'
                });


                var $q = common.$q;

                function getToken(user, password) {
                    var params = {
                        
                    }

                    return context.get('sessions', params)
                        .then(function (result) {
                            _.each(result, function (r) {
                                r.name = mapItemId(r);
                            });
                            def.resolve(result);
                        }).catch(function () {
                            countriesByKidnap(params).then(function (result) {
                                def.resolve(result);
                            });
                        });

                }
                
//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.getToken = getToken;

            }

        ]);
}());