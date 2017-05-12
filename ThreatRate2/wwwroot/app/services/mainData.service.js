(function () {
    'use strict';
    var serviceId = 'mainDataService';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q', 'repo.common', 'repo.locations', 'repo.months', 'repo.ageGroups', 'repo.professionalGroups', 'repo.regions', 'repo.attacks', 'repo.kidnap', 'repo.sessions',
            function ($q, repo, repoLocations, repoMonths, repoAgeGroups, repoProfessionalGroups, repoRegions, repoAttacks, repoKidnap, repoSessions) {

                function countriesByKidnap(params) {
                    return repo.countriesByKidnap(params, true);
                }

                function countriesByKidnapDuration(params) {
                    params.orderBy = 'duration';
                    return repo.countriesByKidnapDuration(params);
                }

                function countriesByKidnapDurationWithComparer(params) {
                    var paramsComparer = angular.copy(params);

                    params = angular.copy(params);
                    delete params.country;
                    params.orderBy = 'duration';

//                    var top = (params.top || 10) + 1;
//                    params.top = top;

                    delete paramsComparer.top;

                    return $q.all([
                        repo.countriesByKidnapDuration(paramsComparer),
                        repo.countriesByKidnapDuration(params)
                    ]).then(function(responses) {
                        return {
                            data: responses[1],
                            comparer: responses[0][0]
                        };
                    });
                }

                function countriesByVehicleAttack(params) {
                    return repo.countriesByVehicleAttack(params);
                }

                function countriesByChildKidnap(params) {
                    return repo.countriesByChildKidnap(params);
                }

                function countriesByForeignersKidnapDuration(params) {
                    return repo.countriesByForeignersKidnapDuration(params);
                }

                function countriesByUnrest(params) {
                    return repo.countriesByUnrest(params);
                }

                function countriesBySuicideAttack(params) {
                    return repo.countriesBySuicideAttack(params);
                }

                function countriesByForeignersKidnap(params) {
                    return repo.countriesByForeignersKidnap(params);
                }

                function countriesByRansom(params) {
                    return repo.countriesByRansom(params);
                }

                function countriesByForeignersVsLocalsKidnap(params) {
                    return $q.all([
                            repo.countriesByForeignersKidnap(params),
                            repo.countriesByLocalsKidnap(params)
                        ])
                        .then(function(result) {
                            return {
                                foreign: result[0],
                                local: result[1]
                            }
                        });
                }

                function countriesByKidnapWithLocations(params) {
                    return repo.countriesByKidnapWithLocations(params);
                }

                function countriesByKidnapByGender(params) {
                    return repo.countriesByKidnapByGender(params);
                    return $q.all([
                        repo.countriesByKidnapByGender(params, false)
                    ])
                        .then(function (result) {
                            var data = result[0];
                            var data2 = result[1];
                            _.each(data, function(d) {
                                var d2 = _.find(data2, { id: d.id });
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

                function countriesByKidnapKilled(params) {
                    return repo.countriesByKidnapKilled(params);
                }

                function regionsByVehicleAttack(params) {
                    return repoRegions.regionsByVehicleEvent(params);
                }

                function locationsByKidnap(params) {
                    return repoLocations.locationsByKidnap(params);
                }

                function locationsByKidnapByGender(params) {
                    return repoLocations.locationsByKidnapByGender(params);
                }

                function monthsByKidnap(params) {
                    return repoMonths.monthsByKidnap(params)
                        .then(function(data) {
                            var result = [];

                            _.each(data, function(d) {
                                var f = _.find(result, { name: d.name });
                                if (!f) {
                                    f = angular.copy(d);
                                    result.push(f);
                                    f.__total = 0;
                                    f.__count = 0;
                                }
                                f.__total += d.value;
                                f.__count++;
                            });

                            _.each(result, function(d) {
                                d.value = Math.round(d.__total / d.__count);
                            });
                            return result;
                        });
                }

                function monthsByYears(params) {

                    var promises = [];
                    var to = 2016;
                    if (params.to) {
                        to = params.to;
                        if (to > 4) {
                            to = params.to.substr(0, 4);
                        }
                        to = parseInt(to);
                    }
                    for (var i = 0; i < 5; i++) {
                        promises.push(repoMonths.monthsByKidnap({ from: '' + (to - i) + '01', to: '' + (to - i) + '12'}));
                    }

                    var def = $q.defer();
                    $q.all(promises).then(function(data) {
                        var result = [];
                        result.push({ year: to - 0, data: data[0] });
                        result.push({ year: to - 1, data: data[1] });
                        result.push({ year: to - 2, data: data[2] });
                        result.push({ year: to - 3, data: data[3] });
                        result.push({ year: to - 4, data: data[4] });

                        def.resolve(result);
                    });

                    return def.promise;
                }

                function ageGroupsByKidnap(params) {
                    return repoAgeGroups.ageGroupsByKidnap(params);
                }

                function ageGroupsByKidnapDuration(params) {
                    return repoAgeGroups.ageGroupsByKidnapDuration(params);
                }

                function professionalGroupsByKidnap(params) {
                    return repoProfessionalGroups.professionalGroupsByKidnap(params);
                }

                function regionsByKidnapSimpleVsMultiple(params) {
                    var promises = [];

                    promises.push(repoRegions.regionsByKidnapSingle(params));
                    promises.push(repoRegions.regionsByKidnapMultiple(params));

                    var def = $q.defer();
                    $q.all(promises).then(function (data) {
                        var result = [];

                        _.each(data[0], function (r1) {
                            var r2 = _.find(data[1], { name: r1.name });

                            var r = {
                                name: r1.name,
                                value: r1.value + r2.value,
                                single: r1,
                                multiple: r2
                            };
                            result.push(r);
                        });

                        def.resolve(result);
                    });

                    return def.promise;                }

                function regionsByKidnapDuration(params) {
                    return repoRegions.regionsByKidnapDuration(params);
                }

                function regionsByKidnapDurationRange(params) {
                    return repoRegions.regionsByKidnapDurationRange(params);
                }

                function regionsByKidnapDurationSimpleVsMultiple(params) {

                    var promises = [];
                    params.include = 'duration_range,ransom_range';
                    promises.push(repoRegions.regionsByKidnapSingle(params));
                    promises.push(repoRegions.regionsByKidnapMultiple(params));

                    var def = $q.defer();
                    $q.all(promises).then(function (data) {
                        var result = [];

                        _.each(data[0], function(r1) {
                            var r2 = _.find(data[1], { name: r1.name });

                            var r = {
                                name: r1.name,
                                value: r1.value + r2.value,
                                single: r1,
                                multiple: r2
                            };
                            result.push(r);
                        });

                        def.resolve(result);
                    });

                    return def.promise;
                }

                function terroristAttackTypes(params) {
                    return repoAttacks.terroristAttackTypes(params);
                }

                function kidnapResults(params) {
                    return repoKidnap.kidnapResults(params);
                }

                function getToken(user, password) {
                    return repoSessions.getToken(user, password);
                }

                return {
                    countriesByKidnap: countriesByKidnap,
                    countriesByKidnapDuration: countriesByKidnapDuration,
                    countriesByKidnapDurationWithComparer: countriesByKidnapDurationWithComparer,
                    countriesByVehicleAttack: countriesByVehicleAttack,
                    countriesByChildKidnap: countriesByChildKidnap,
                    countriesByForeignersKidnapDuration: countriesByForeignersKidnapDuration,
                    countriesByUnrest: countriesByUnrest,
                    countriesBySuicideAttack: countriesBySuicideAttack,
                    countriesByForeignersKidnap: countriesByForeignersKidnap,
                    countriesByRansom: countriesByRansom,
                    countriesByForeignersVsLocalsKidnap: countriesByForeignersVsLocalsKidnap,
                    countriesByKidnapWithLocations: countriesByKidnapWithLocations,
                    countriesByKidnapByGender: countriesByKidnapByGender,
                    countriesByKidnapKilled: countriesByKidnapKilled,

                    regionsByVehicleAttack: regionsByVehicleAttack,
                    regionsByKidnapSimpleVsMultiple: regionsByKidnapSimpleVsMultiple,
                    regionsByKidnapDuration: regionsByKidnapDuration,
                    regionsByKidnapDurationRange: regionsByKidnapDurationRange,
                    regionsByKidnapDurationSimpleVsMultiple: regionsByKidnapDurationSimpleVsMultiple,

                    locationsByKidnap: locationsByKidnap,
                    locationsByKidnapByGender: locationsByKidnapByGender,

                    monthsByKidnap: monthsByKidnap,
                    monthsByYears: monthsByYears,

                    ageGroupsByKidnap: ageGroupsByKidnap,
                    ageGroupsByKidnapDuration: ageGroupsByKidnapDuration,

                    professionalGroupsByKidnap: professionalGroupsByKidnap,

                    terroristAttackTypes: terroristAttackTypes,
                    
                    kidnapResults: kidnapResults,

                    getToken: getToken,


                }


            }
        ]);
}());