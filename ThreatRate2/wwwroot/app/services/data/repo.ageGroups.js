(function () {
    'use strict';
    var serviceId = 'repo.ageGroups';
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
                    { name: '1-10', title: '1-10 years' },
                    { name: '11-18', title: '11-18 years' },
                    { name: '19-25', title: '19-25 years' },
                    { name: '26-35', title: '26-35 years' },
                    { name: '36-65', title: '36-65 years' },
                    { name: '66 up', title: '66 up' },
                    { name: 'N/A', title: 'N/A' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function ageGroupsByKidnapDuration(params) {
                    return ageGroupsByKidnap(params, 'duration_range,ransom_range');
                }

                function ageGroupsByKidnap(params, include) {
                    params = params || {};

                    params.id = params.from || '199001';
                    params.id2 = params.to || '201801';

                    params.from = null;
                    params.to = null;

//                    if (include) {
                    params.include = include;
//                    }


                    var def = $q.defer();

                    context.get('ageGroupsByKidnap', params)
                        .then(function (data) {
                            var result = _.map(_items, function(it) {
                                var r = _.find(data, { name: it.name });
                                if (r) {
                                    r.name = r.title;
                                    r.title = r.title;
                                } else {
                                    r = angular.copy(it);
                                };

//                                if (r.duration_range) {
//                                    if (r.duration_range.from < 0) {
//                                        r.duration_range.from = 0;
//                                    }
//                                }
                                return r;
                            });
                            def.resolve(result);
                        }).catch(function () {
                            var result = renderList(_items, function (n, it) {
                                var rnd = Math.random();
                                return {
                                    value: Math.round(rnd * 200),
                                    name: it.name,
                                    title: it.title, // to move into directive
                                    duration_range: {
                                        from: Math.round(Math.random() * 10),
                                        to: Math.round(Math.random() * 50)
                                    }, // to move into directive
                                    ransom_range: {
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


                this.ageGroupsByKidnap = ageGroupsByKidnap;
                this.ageGroupsByKidnapDuration = ageGroupsByKidnapDuration;
            }
        ]);
}());