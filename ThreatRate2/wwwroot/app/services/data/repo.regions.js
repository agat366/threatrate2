(function () {
    'use strict';
    var serviceId = 'repo.regions';
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

                var _items = [
                    { id: 1, name: 'europe', title: 'Europe' },
                    { id: 2, name: 'asia', title: 'Asia' },
                    { id: 3, name: 'namerica', title: 'America' },
                    { id: 4, name: 'samerica', title: 'LATAM' },
                    { id: 5, name: 'africa', title: 'Africa' },
                    { id: 6, name: 'australia', title: 'Australia' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function regionsByVehicleEvent(params) {
                    return regionsByKidnap(params);
                }
                function regionsByKidnapSimpleVsMultiple(params) {
                    return regionsByKidnap(params);
                }

                function regionsByKidnapDuration(params) {
                    return regionsByKidnap(params);
                }

                function regionsByVehicleAttack(params) {
                    return regionsByKidnap(params);
                }

                function regionsByKidnap(params) {
                    params = params || {};

                    var def = $q.defer();

                    context.get('monthsByKidnap', params)
                        .then(function (result) {
                            def.resolve(result);
                        }).catch(function () {
                            var result = renderList(_items, function (n, it) {
                                var rnd = Math.random();
                                return {
                                    value: Math.round(rnd * 200),
                                    id: it.id,
                                    name: it.name,
                                    title: it.title, // to move into directive
                                    single: Math.round(Math.random() * 150),
                                    multi: Math.round(Math.random() * 50),
                                    duration: Math.round(Math.random() * 50),
                                    duration_range: {
                                        from: Math.round(Math.random() * 10),
                                        to: Math.round(Math.random() * 50)
                                    }, // to move into directive
                                    ransom_range: {
                                        from: Math.round(Math.random() * 2),
                                        to: Math.round(Math.random() * 15)
                                    },

                                    multi_duration: Math.round(Math.random() * 50),
                                    multi_duration_range: {
                                        from: Math.round(Math.random() * 10),
                                        to: Math.round(Math.random() * 50)
                                    }, // to move into directive
                                    multi_ransom_range: {
                                        from: Math.round(Math.random() * 2),
                                        to: Math.round(Math.random() * 15)
                                    }

                                }
                            });
                            def.resolve(result);
                        });

                    return def.promise;
                }

//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.regionsByKidnap = regionsByKidnap;
                this.regionsByVehicleEvent = regionsByVehicleEvent;
                this.regionsByKidnapSimpleVsMultiple = regionsByKidnapSimpleVsMultiple;
                this.regionsByKidnapDuration = regionsByKidnapDuration;
                this.regionsByVehicleAttack = regionsByVehicleAttack;
            }
        ]);
}());