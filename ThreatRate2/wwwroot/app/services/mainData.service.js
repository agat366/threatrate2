(function () {
    'use strict';
    var serviceId = 'mainDataService';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q', 'repo.common', 'repo.locations', 'repo.months', 'repo.ageGroups', 'repo.professionalGroups', 'repo.regions', 'repo.attacks',
            function ($q, repo, repoLocations, repoMonths, repoAgeGroups, repoProfessionalGroups, repoRegions, repoAttacks) {

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

                function countriesByKidnapKilled(params) {
                    return repo.countriesByKidnapKilled(params);
                }

                function regionsByVehicleAttack(params) {
                    return repoRegions.regionsByVehicleAttack(params);
                }

                function locationsByKidnap(params) {
                    return repoLocations.locationsByKidnap(params);
                }

                function monthsByKidnap(params) {
                    return repoMonths.monthsByKidnap(params);
                }

                function ageGroupsByKidnap(params) {
                    return repoAgeGroups.ageGroupsByKidnap(params);
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
                    countriesByKidnapKilled: countriesByKidnapKilled,
                    regionsByVehicleAttack: regionsByVehicleAttack,
                    locationsByKidnap: locationsByKidnap,
                    monthsByKidnap: monthsByKidnap,
                    ageGroupsByKidnap: ageGroupsByKidnap,
                    professionalGroupsByKidnap: professionalGroupsByKidnap,
                    regionsByKidnapSimpleVsMultiple: regionsByKidnapSimpleVsMultiple,

                    terroristAttackTypes: terroristAttackTypes
                }
            }
        ]);
}());