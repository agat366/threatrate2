﻿(function () {
    'use strict';
    var serviceId = 'repo.regions';
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

                var _items = [
                    { id: 1, name: 'europe', title: 'Europe' },
                    { id: 2, name: 'asia', title: 'Asia' },
                    { id: 3, name: 'namerica', title: 'America' },
                    { id: 4, name: 'samerica', title: 'LATAM' },
                    { id: 5, name: 'africa', title: 'Africa' },
                    { id: 6, name: 'oceania', title: 'Oceania' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function allRegions() {
                    return angular.copy(_items);
                }

                function regionsByVehicleEvent(params) {
                    params.filter = 'vehicle';
                    return regions(params);
                }
                function regionsByKidnapSingle(params) {
                    params.filter = 'single';
                    return regionsByKidnap(params);
                }

                function regionsByKidnapMultiple(params) {
                    params.filter = 'multi';
                    return regionsByKidnap(params);
                }

                function regionsByKidnapDuration(params) {
                    params.include = 'duration,ransom';
                    return regionsByKidnap(params);
                }

                function regionsByKidnapDurationRange(params) {
                    params.include = 'duration_range,ransom_range';
                    return regionsByKidnap(params);
                }

                function regionsByVehicleAttack(params) {
                    return regionsByKidnap(params);
                }

                function regions(params) {
                    params = angular.copy(params || {});

                    params.id = params.from;
                    params.id2 = params.to;

                    params.from = null;
                    params.to = null;

                    var def = $q.defer();

                    context.get('regionsByEventType', params)
                        .then(function (data) {
                            var result = _.map(_items, function (sys) {
                                var found = _.find(data, function (r0) {
                                    var name = sys.name;
                                    if (name === 'australia') {
                                        name = 'oceania';
                                    }
                                    return r0.title == name || r0.name == name;
                                });
                                if (found) {
                                    found.name = sys.name;
                                    found.title = sys.title;
                                } else {
                                    found = angular.copy(sys);
                                    found.value = 0;
                                }
                                return found;
                            });
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
                function regionsByKidnap(params) {
                    params = angular.copy(params || {});

                    params.id = params.from;
                    params.id2 = params.to;

                    params.from = null;
                    params.to = null;

                    var def = $q.defer();

                    context.get('regionsByKidnap', params)
                        .then(function (data) {
                            var result = _.map(_items, function(sys) {
                                var found = _.find(data, function (r0) {
                                    var name = sys.name;
                                    if (name === 'australia') {
                                        name = 'oceania';
                                    }
                                    return r0.title == name || r0.name == name;
                                });
                                if (found) {
                                    found.name = sys.name;
                                    found.title = sys.title;
                                } else {
                                    found = angular.copy(sys);
                                    found.value = 0;
                                }
                                return found;
                            });
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


                this.allRegions = allRegions;
                this.regionsByKidnap = regionsByKidnap;
                this.regionsByVehicleEvent = regionsByVehicleEvent;
                this.regionsByKidnapSingle = regionsByKidnapSingle;
                this.regionsByKidnapMultiple = regionsByKidnapMultiple;
                this.regionsByKidnapDuration = regionsByKidnapDuration;
                this.regionsByKidnapDurationRange = regionsByKidnapDurationRange;
            }
        ]);
}());