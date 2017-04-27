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
                    controller: 'v1'
                });

                var $q = common.$q;

                var _items = [
                    { id: 1, name: 'hijaking', title: 'Hijacking / Hostage Taking', alternateTitle: 'Hijacking/Hostage Taking' },
                    { id: 2, name: 'wmd', title: 'WMD' },
                    { id: 2, name: 'cyber', title: 'Cyber-attack' },
                    { id: 3, name: 'arson', title: 'Arson' },
                    { id: 4, name: 'grenade', title: 'Grenade attack' },
                    { id: 5, name: 'assassination', title: 'Assassination' },
                    { id: 6, name: 'vbied', title: 'VBIED' },
                    { id: 7, name: 'combined', title: 'Combined Attack' },
                    { id: 8, name: 'vehicle', title: 'Vehicular attack' },
                    { id: 9, name: 'projectiles', title: 'Projectiles' },
                    { id: 10, name: 'cold', title: 'Cold weapons' },
                    { id: 11, name: 'suicide-vbied', title: 'Suicide VBIED' },
                    { id: 12, name: 'suicide-bombing', title: 'Suicide Bombing' },
                    { id: 13, name: 'bombing', title: 'Bombing (IED)' },
                    { id: 14, name: 'shooting', title: 'Shooting' },
                    { id: 15, name: 'other', title: 'Other' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function mapItemId(item) {
                    var sysItem = _.find(_items, function(c) {
                         return c.title == item.title || c.title == item.alternateTitle;
                    });
                    if (sysItem) {
                        return sysItem.name;
                    }
                    return item.title.toLowerCase().replace(/\s/gi, '-');
                }


                function terroristAttackTypes(params) {

                    params = params || {};

                    params.id = params.from || '199001';
                    params.id2 = params.to || '201801';

                    params.from = null;
                    params.to = null;

                    var def = $q.defer();

                    context.get('attacksTypes', params)
                        .then(function (result) {

                            _.each(result, function (r) {
                                r.name = mapItemId(r);
                                r.value = parseInt(r.value);
                            });

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