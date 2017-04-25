(function (angular) {
    'use strict';

    var controllerName = 'MainController';
    angular.module('tr').controller(controllerName, ['mainDataService', '$scope',
        function (dataService, $scope) {
        var vm = this;

        vm.isLoading = false;

        vm.charts = [
            {
                id: '',
                label: '- select -',
                service: function () {
                    vm.isLoading = false;
                    return { then: function() {} };
                }
            },
            {
                id: 'countriesByKidnap',
                title: '01 - Highest kidnap countries',
                service: function() {
                    return dataService.countriesByKidnap({ top: 186 });
                }
            },
            {
                id: 'countriesByKidnapTop30',
                title: '02 - Top 30 highest kidnap countries',
                service: function () {
                    return dataService.countriesByKidnap({ top: 30 });
                }
            },
            {
                id: 'locationsByKidnap',
                default: false,
                title: '03 - Kidnap activity by location // AUG 2015 - AUG 2016',
                service: function () {
                    return dataService.locationsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'monthsByKidnap',
                title: '04 - Most dangerous months',
                service: function () {
                    return dataService.monthsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'ageGroupsByKidnap',
                title: '05 - Age Groups by Kidnapping',
                default: false,
                service: function () {
                    return dataService.ageGroupsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'professionalGroupsByKidnap',
                title: '06 - Professional Groups by Kidnapping',
                default: false,
                service: function () {
                    return dataService.professionalGroupsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'regionsByKidnapSimpleVsMultiple',
                title: '07 - SINGLE VERSUS MULTIPLE KIDNAPPING ACTIVITY // 2015',
                service: function () {
                    return dataService.regionsByKidnapSimpleVsMultiple({from: null, to: null});
                }
            },
            {
                id: 'countriesByLongestKidnapDurationTop3',
                title: '08 - TOP 3 COUNTRIES WHERE KIDNAPPING VICTIMS WERE HELD THE LONGEST // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByKidnapDuration({top: 3, from: null, to: null});
                }
            },
            {
                id: 'countriesByVehicleAttackTop3',
                title: '09 - TOP 3 COUNTRIES WITH THE HIGHEST NUMBER OF VEHICLE ATTACKS // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByVehicleAttack({top: 3, from: null, to: null});
                }
            },
            {
                id: 'countriesByChildKidnapTop5',
                title: '10 - TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF CHILD KIDNAPPINGS // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByChildKidnap({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByForeignersKidnapDurationTop5',
                title: '11 - List of 5 countries where kidnapped foreigners where held the longest // jan - oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnapDuration({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByUnrestTop5',
                title: '12 - List of 5 countries registered the most civil unrest events // 2016',
                service: function () {
                    return dataService.countriesByUnrest({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesBySuicideAttackTop5',
                title: '13 - TOP 5 COUTRSIES WITH THE LARGEST NUMBER OF SUICIDE BOMBING ATTACKS // Q2/2011-Q2/2016',
                service: function () {
                    return dataService.countriesBySuicideAttack({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapKilledTop5',
                title: '14 - TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF KIDNAPPING VICTIMS KILLED // 2015',
                service: function () {
                    return dataService.countriesByKidnapKilled({top: 5, from: null, to: null});
                }
            },
            {
                id: 'regionsByVehicleAttack',
                title: '15 - VEHICLE ATTACKS ACTIVITY ACROSS REGIONS // 2015',
                service: function () {
                    return dataService.regionsByVehicleAttack({from: null, to: null});
                }
            },
            {
                id: 'countriesByForeignersKidnapTop10',
                title: '16 - List of 10 countries with highest kidnapping of foreigners // jan-oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnap({top: 10, from: null, to: null});
                }
            },
            {
                id: 'countriesByRansomTop5',
                title: '17 - Top 5 Countries with highest average ransom amount // jan-oct 2016',
                service: function () {
                    return dataService.countriesByRansom({top: 5, from: null, to: null});
                }
            },
            {
                id: 'terroristAttackTypes',
                title: '18 - FREQUENCY OF TERRORIST ATTACK TYPES // 2016',
                service: function () {
                    return dataService.terroristAttackTypes({from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapWithLocationsTop10',
                title: '19 - COUNTRIES MOST KIDNAPPED AT FURTHER ANALYZED BY GEO-LOCATION',
                service: function () {
                    return dataService.countriesByKidnapWithLocations({top: 10, from: null, to: null});
                }
            },
            {
                id: 'monthsByYears5',
                title: '20 - FIVE YEAR VIEW ON “NOVEMBER”',
                service: function () {
                    return dataService.monthsByYears({from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapByGender',
                title: '21 - Countries most kidnapped at by gender// June 2010 - March 2017',
//                default: true,
                service: function () {
                    return dataService.countriesByKidnapByGender({top: 11, from: null, to: null});
                }
            },
            {
                id: 'locationsByKidnapByGender',
                default: true,
                title: '22 - IS THERE A DIFFERENCE WHERE WOMEN GET KIDNAPPED FROM VERSUS MAN',
                service: function () {
                    return dataService.locationsByKidnapByGender({top: 11, from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapDurationTop10',
                title: '23 - Countries by kidnap duration and ransom',
                default: false,
                service: function () {
                    return dataService.countriesByKidnapDuration({top: 11, from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapDurationGridTop10',
                title: '24 - KIDNAP DURATION AND RANSOM FOR THE TOP 10 COUNTRIES',
                service: function () {
                    return dataService.countriesByKidnapDuration({top: 10, from: null, to: null});
                }
            },
            {
                id: 'ageGroupsByKidnapDurationGrid',
                title: '25 - KIDNAP DURATION AND RANSOM AMOUNT CORRELATION WITH AGE',
                service: function () {
                    return dataService.ageGroupsByKidnapDuration({from: null, to: null});
                }
            },
            {
                id: 'kidnapResults',
                title: '26 - KIDNAP RESULTS - KILLED, RELEASED, ESCAPED, RESCUED',
                service: function () {
                    return dataService.kidnapResults({from: null, to: null});
                }
            },
            {
                id: 'regionsByKidnapDurationSimpleVsMultiple',
                title: '27 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION FOR SINGLE AND MULTIPLE KIDNAPPING',
                service: function () {
                    return dataService.regionsByKidnapDurationSimpleVsMultiple({from: null, to: null});
                }
            },
            {
                id: 'regionsByKidnapDurationAndRansom',
                title: '28 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION',
//                default: true,
                service: function () {
                    return dataService.regionsByKidnapDuration({from: null, to: null});
                }
            },
            {
                id: 'countriesByForeignersVsLocalsKidnapTop5',
                title: '29 - TOP 5 COUNTRIES FOR FOREIGNERS KIDNAPPING VERSUS TOP 5 COUNTRIES FOR LOCALS KIDNAPPINGS',
                service: function () {
                    return dataService.countriesByForeignersVsLocalsKidnap({ top: 5, from: null, to: null });
                }
            },
            {
//                default: true,
                id: 'countriesByForeignersVsLocalsKidnapTop10',
                title: '30 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION FOR SINGLE AND MULTIPLE KIDNAPPING',
                service: function () {
                    return dataService.countriesByForeignersVsLocalsKidnap({ top: 10, from: null, to: null});
                }
            },
            {
//                default: true,
                id: 'countriesTest',
                title: '-- - Countries test',
                service: function () {
                    vm.isLoading = false;
                    return { then: function () { } };
                }
            }
        ];

        vm.currentChart = _.find(vm.charts, { default: true }) || vm.charts[0];

        vm.reload = function() {
            loadData();
        };

        $scope.$watch('vm.currentChart', loadData);

        function loadData() {
            vm.isLoading = true;
            if (vm.currentChart) {
                vm.data = null;
                vm.chartId = vm.currentChart.id;


                vm.currentChart.service()
                    .then(function(data) {
                        vm.data = data;
                        vm.isLoading = false;
                    });
            } else {
                vm.isLoading = false;
            }
        }

            vm.processCountries = function() {

            };
        }]);
    
}(angular));
