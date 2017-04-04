(function () {
    'use strict';
    var serviceId = 'repo.months';
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
                    { name: 'jan', title: 'January' },
                    { name: 'feb', title: 'February' },
                    { name: 'mar', title: 'March' },
                    { name: 'apr', title: 'April' },
                    { name: 'may', title: 'May' },
                    { name: 'jun', title: 'June' },
                    { name: 'jul', title: 'July' },
                    { name: 'aug', title: 'August' },
                    { name: 'sep', title: 'September' },
                    { name: 'oct', title: 'October' },
                    { name: 'nov', title: 'November' },
                    { name: 'dec', title: 'December' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function monthsByKidnap(params) {
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
                                    name: it.name,
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


                this.monthsByKidnap = monthsByKidnap;
            }
        ]);
}());