(function () {
    'use strict';
    var serviceId = 'repo.attacks';
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
                    { id: 1, name: 'hijaking', title: '' },
                    { id: 1, name: 'wmd', title: '' },
                    { id: 1, name: 'arson', title: '' },
                    { id: 1, name: 'grenade', title: '' },
                    { id: 1, name: 'assassination', title: '' },
                    { id: 1, name: 'vbied', title: '' },
                    { id: 1, name: 'combined', title: '' },
                    { id: 1, name: 'vehicle', title: '' },
                    { id: 1, name: 'projectiles', title: '' },
                    { id: 1, name: 'cold', title: '' },
                    { id: 1, name: 'suicide-vbied', title: '' },
                    { id: 1, name: 'suicide-bombing', title: '' },
                    { id: 1, name: 'bombing', title: '' },
                    { id: 1, name: 'shooting', title: '' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function terroristAttackTypes(params) {

                    params = params || {};

                    var def = $q.defer();

                    context.get('terroristAttackTypes', params)
                        .then(function (result) {
                            def.resolve(result);
                        }).catch(function () {
                            var result = renderList(_items, function (n, it) {
                                var rnd = Math.random();
                                return {
                                    value: Math.round(rnd * 200),
                                    id: it.id,
                                    name: it.name,
                                    title: it.name.replace('-', ' ') //it.title // to move into directive
                                }
                            });
                            def.resolve(result);
                        });

                    return def.promise;
                }

//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.terroristAttackTypes = terroristAttackTypes;
            }
        ]);
}());