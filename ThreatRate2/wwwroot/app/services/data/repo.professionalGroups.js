(function () {
    'use strict';
    var serviceId = 'repo.professionalGroups';
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
                    { name: '', title: 'Retails' },
                    { name: '', title: 'Government' },
                    { name: '', title: 'Education' },
                    { name: '', title: 'Agriculture' },
                    { name: '', title: 'Religion' },
                    { name: '', title: 'NGO' },
                    { name: '', title: 'Transportation' },
                    { name: '', title: 'Security agencies' },
                    { name: '', title: 'Media' },
                    { name: '', title: 'Oil/Gas/Mining' },
                    { name: '', title: 'Services' },
                    { name: '', title: 'Medical' },
                    { name: '', title: 'Financial' },
                    { name: '', title: 'Real Estate & Const 11' },
                    { name: '', title: 'Entertainment' },
                    { name: '', title: 'Hospitality' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function professionalGroupsByKidnap(params) {
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
                                    name: it.title,
                                    title: it.title // to move into directive
                                }
                            });
                            def.resolve(result);
                        });

                    return def.promise;
                }

//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.professionalGroupsByKidnap = professionalGroupsByKidnap;
            }
        ]);
}());