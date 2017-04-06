(function () {
    'use strict';
    var serviceId = 'repo.locations';
    angular
        .module('tr')
        .service(serviceId,
        [
            'data', 'common',
            function(dataContext, common) {

                var context = dataContext.context({
                    controller: 'v3'
                });

                var $q = common.$q;

                var _locations = [
                    { name: 'home', title: 'Home' },
                    { name: 'hotel', title: 'Hotel' },
                    { name: 'street', title: 'Street' },
                    { name: 'vessel', title: 'Vessel' },
                    { name: 'public-area', title: 'Public Area' },
                    { name: 'vehicle', title: 'Vehicle' },
                    { name: 'education', title: 'Education Venue' },
                    { name: 'worship', title: 'House of Worship' },
                    { name: 'office', title: 'Office/Business' },
                    { name: 'other', title: 'Other' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function locationsByKidnapByGender(params) {
                    return locationsByKidnap(params);
                }

                function locationsByKidnap(params) {
                    params = params || {};

                    var def = $q.defer();

                    context.get('locationsByKidnap', params)
                        .then(function (result) {
                            def.resolve(result);
                        }).catch(function () {
                            var result = renderList(_locations, function (n, loc) {
                                var rnd = Math.random();
                                return {
                                    value: Math.round(rnd * 200),
                                    name: loc.name,
                                    title: loc.title, // to move into directive
                                    males: Math.round(Math.random() * 150),
                                    females: Math.round(Math.random() * 50)
                                }
                            });
                            def.resolve(result);
                        });

                    return def.promise;
                }

//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.locationsByKidnap = locationsByKidnap;
                this.locationsByKidnapByGender = locationsByKidnapByGender;
            }
        ]);
}());