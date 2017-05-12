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
                    controller: 'v1'
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
                    { name: 'office', title: 'Office / Business', alternateTitle: 'Office/Business' },
                    { name: 'other', title: 'Other' },
                    { name: 'unknown', title: 'Unknown' }
                ];
                function renderList(list, iterator) {
                    var result = [];
                    for (var i = 0; i < list.length; i++) {
                        result.push(iterator(i, list[i]));
                    }
                    return result;
                }

                function locationsByKidnapByGender(params) {
                    params = params || {};

                    var males = angular.copy(params);
                    males.filter = 'males';

                    var females = angular.copy(params);
                    females.filter = 'females';

                    return $q.all([
                        locationsByKidnap(males),
                        locationsByKidnap(females)
                    ])
                        .then(function (result) {
                            var data = result[0];
                            var data2 = result[1];
                            _.each(data, function (d) {
                                var d2 = _.find(data2, { name: d.name });
                                var d2Value = 0;
                                if (d2) {
                                    d2Value = d2.value;
                                }
                                d.males = d.value;
                                d.females = d2Value;
                                d.value = d.males + d2Value;
                            });
                            return data;
                        });
                }

                function mapItemId(item) {
                    var sysItem = _.find(_locations, { title: item.title }) || _.find(_locations, { alternateTitle: item.title });
                    if (sysItem) {
                        item.title = sysItem.title;
                        return sysItem.name;
                    }
                    return 'id' + item.id;
                }


                function locationsByKidnap(params) {
                    params = params || {};

                    var def = $q.defer();

                    params.id = params.from || '19900101';
                    params.id2 = params.to || '20180101';

                    params.from = null;
                    params.to = null;

                    context.get('locationsByKidnap', params)
                        .then(function (response) {
                            var locations = angular.copy(_locations);
                            var result = _.map(locations, function(l) {
                                var it = _.find(response, function(r) {
                                    return l.title == r.title || l.alternateTitle == r.title;
                                });
                                if (it) {
                                    it.title = l.title;
                                    it.name = l.name;
                                    return it;
                                } else {
                                    l.value = 0;
                                    l.percentage = 0;
                                    return l;
                                }
                            });

                            def.resolve(response);
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