(function () {
    'use strict';
    var serviceId = 'repo.kidnap';
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
                    { id: 1, name: 'killed', title: '' },
                    { id: 1, name: 'released', title: '' },
                    { id: 1, name: 'escaped', title: '' },
                    { id: 1, name: 'rescued', title: '' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function kidnapResults(params) {

                    params.id = params.from;
                    params.id2 = params.to;

                    return kidnapResultsPerYear(params);

                    var promises = [];
                    promises.push(kidnapResultsPerYear({ year: 2016 }));
                    promises.push(kidnapResultsPerYear({ year: 2015 }));
                    promises.push(kidnapResultsPerYear({ year: 2014 }));
                    promises.push(kidnapResultsPerYear({ year: 2013 }));
                    promises.push(kidnapResultsPerYear({ year: 2012 }));

                    var def = $q.defer();
                    $q.all(promises).then(function (data) {
                        var result = [];
                        result.push(data[0]);
                        result.push(data[1]);
                        result.push(data[2]);
                        result.push(data[3]);
                        result.push(data[4]);

                        def.resolve(result);
                    });

                    return def.promise;

                }
                function kidnapResultsPerYear(params) {

                    params = params || {};

                    var def = $q.defer();

                    context.get('yearsByKidnapResult', params)
                        .then(function (result) {

                            _.each(result, function(r) {
                                r.year = parseInt(r.title);
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
                            var value = _.reduce(_.map(result, function(el) { return el.value; }),
                                function(memo, num) { return memo + num; }, 0);

                            var year = {
                                title: params.year,
                                year: params.year,
                                data: result,
                                value: value
                            };
                            def.resolve(year);
                        });

                    return def.promise;
                }

//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.kidnapResults = kidnapResults;
            }
        ]);
}());