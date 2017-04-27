(function () {
    'use strict';
    var serviceId = 'mainDataService';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q', 'repo.common', 'repo.locations', 'repo.months', 'repo.ageGroups', 'repo.professionalGroups', 'repo.regions', 'repo.attacks', 'repo.kidnap',
            function ($q, repo, repoLocations, repoMonths, repoAgeGroups, repoProfessionalGroups, repoRegions, repoAttacks, repoKidnap) {

                function countriesByKidnap(params) {
                    return repo.countriesByKidnap(params, true);
                }

                function countriesByKidnapDuration(params) {
                    return repo.countriesByKidnapDuration(params);
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
                    return $q.all([
                        repo.countriesByKidnapByGender(params, true),
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
                    return repoMonths.monthsByKidnap(params);
                }

                function monthsByYears(params) {

                    var promises = [];
                    promises.push(repoMonths.monthsByKidnap({from: 201601, to: 201612}));
                    promises.push(repoMonths.monthsByKidnap({from: 201501, to: 201512}));
                    promises.push(repoMonths.monthsByKidnap({from: 201401, to: 201412}));
                    promises.push(repoMonths.monthsByKidnap({from: 201301, to: 201312}));
                    promises.push(repoMonths.monthsByKidnap({from: 201201, to: 201212}));

                    var def = $q.defer();
                    $q.all(promises).then(function(data) {
                        var result = [];
                        result.push({ year: 2016, data: data[0] });
                        result.push({ year: 2015, data: data[1] });
                        result.push({ year: 2014, data: data[2] });
                        result.push({ year: 2013, data: data[3] });
                        result.push({ year: 2012, data: data[4] });

                        def.resolve(result);
                    });

                    return def.promise;
                }

                function ageGroupsByKidnap(params) {
                    params.from = '201501';
                    params.to = '201612';
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

                return {
                    countriesByKidnap: countriesByKidnap,
                    countriesByKidnapDuration: countriesByKidnapDuration,
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


                }


            }
        ]);
}());