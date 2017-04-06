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
                    return repo.countriesByKidnap(params);
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

                function countriesByKidnapWithLocations(params) {
                    return repo.countriesByKidnapWithLocations(params);
                }

                function countriesByKidnapByGender(params) {
                    return repo.countriesByKidnapByGender(params);
                }

                function countriesByKidnapKilled(params) {
                    return repo.countriesByKidnapKilled(params);
                }

                function regionsByVehicleAttack(params) {
                    return repoRegions.regionsByVehicleAttack(params);
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
                    promises.push(repoMonths.monthsByKidnap({year: 2016}));
                    promises.push(repoMonths.monthsByKidnap({year: 2015}));
                    promises.push(repoMonths.monthsByKidnap({year: 2014}));
                    promises.push(repoMonths.monthsByKidnap({year: 2013}));
                    promises.push(repoMonths.monthsByKidnap({year: 2012}));

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
                    return repoAgeGroups.ageGroupsByKidnap(params);
                }

                function ageGroupsByKidnapDuration(params) {
                    return repoAgeGroups.ageGroupsByKidnapDuration(params);
                }

                function professionalGroupsByKidnap(params) {
                    return repoProfessionalGroups.professionalGroupsByKidnap(params);
                }

                function regionsByKidnapSimpleVsMultiple(params) {
                    return repoRegions.regionsByKidnapSimpleVsMultiple(params);
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
                    countriesByKidnapWithLocations: countriesByKidnapWithLocations,
                    countriesByKidnapByGender: countriesByKidnapByGender,
                    countriesByKidnapKilled: countriesByKidnapKilled,

                    regionsByVehicleAttack: regionsByVehicleAttack,
                    regionsByKidnapSimpleVsMultiple: regionsByKidnapSimpleVsMultiple,

                    locationsByKidnap: locationsByKidnap,
                    locationsByKidnapByGender: locationsByKidnapByGender,

                    monthsByKidnap: monthsByKidnap,
                    monthsByYears: monthsByYears,

                    ageGroupsByKidnap: ageGroupsByKidnap,
                    ageGroupsByKidnapDuration: ageGroupsByKidnapDuration,

                    professionalGroupsByKidnap: professionalGroupsByKidnap,

                    terroristAttackTypes: terroristAttackTypes,
                    
                    kidnapResults: kidnapResults
                }
            }
        ]);
}());