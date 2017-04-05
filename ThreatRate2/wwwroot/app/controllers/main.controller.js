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
                title: 'Highest kidnap countries',
                service: function() {
                    return dataService.countriesByKidnap();
                }
            },
            {
                id: 'countriesByKidnapTop30',
                title: 'Top 30 highest kidnap countries',
                service: function () {
                    return dataService.countriesByKidnap({ top: 30 });
                }
            },
            {
                id: 'locationsByKidnap',
                title: 'Kidnap activity by location // AUG 2015 - AUG 2016',
                service: function () {
                    return dataService.locationsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'monthsByKidnap',
                title: 'Most dangerous months',
                service: function () {
                    return dataService.monthsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'ageGroupsByKidnap',
                title: 'Age Groups by Kidnapping',
                service: function () {
                    return dataService.ageGroupsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'professionalGroupsByKidnap',
                title: 'Professional Groups by Kidnapping',
                service: function () {
                    return dataService.professionalGroupsByKidnap({from: null, to: null});
                }
            },
            {
                id: 'regionsByKidnapSimpleVsMultiple',
                title: 'SINGLE VERSUS MULTIPLE KIDNAPPING ACTIVITY // 2015',
                service: function () {
                    return dataService.regionsByKidnapSimpleVsMultiple({from: null, to: null});
                }
            },
            {
                id: 'countriesByLongestKidnapDurationTop3',
                title: 'TOP 3 COUNTRIES WHERE KIDNAPPING VICTIMS WERE HELD THE LONGEST // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByKidnapDuration({top: 3, from: null, to: null});
                }
            },
            {
                id: 'countriesByVehicleAttackTop3',
                title: 'TOP 3 COUNTRIES WITH THE HIGHEST NUMBER OF VEHICLE ATTACKS // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByVehicleAttack({top: 3, from: null, to: null});
                }
            },
            {
                id: 'countriesByChildKidnapTop5',
                title: 'TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF CHILD KIDNAPPINGS // Q1-Q2/2016',
                service: function () {
                    return dataService.countriesByChildKidnap({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByForeignersKidnapDurationTop5',
                title: 'List of 5 countries where kidnapped foreigners where held the longest // jan - oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnapDuration({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByUnrestTop5',
                title: 'List of 5 countries registered the most civil unrest events // 2016',
                service: function () {
                    return dataService.countriesByUnrest({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesBySuicideAttackTop5',
                title: 'TOP 5 COUTRSIES WITH THE LARGEST NUMBER OF SUICIDE BOMBING ATTACKS // Q2/2011-Q2/2016',
                service: function () {
                    return dataService.countriesBySuicideAttack({top: 5, from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapKilledTop5',
                title: 'TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF KIDNAPPING VICTIMS KILLED // 2015',
                service: function () {
                    return dataService.countriesByKidnapKilled({top: 5, from: null, to: null});
                }
            },
            {
                id: 'regionsByVehicleAttack',
                title: 'VEHICLE ATTACKS ACTIVITY ACROSS REGIONS // 2015',
                service: function () {
                    return dataService.regionsByVehicleAttack({from: null, to: null});
                }
            },
            {
                id: 'countriesByForeignersKidnapTop10',
                title: 'List of 10 countries with highest kidnapping of foreigners // jan-oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnap({top: 10, from: null, to: null});
                }
            }/*,
            {
                id: 'countriesByForeignersKidnapTop10',
                default: true,
                title: 'List of 10 countries with highest kidnapping of foreigners // jan-oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnap({top: 10, from: null, to: null});
                }
            }*/,
            {
                id: 'terroristAttackTypes',
                title: 'FREQUENCY OF TERRORIST ATTACK TYPES // 2016',
                service: function () {
                    return dataService.terroristAttackTypes({from: null, to: null});
                }
            },
            {
                id: 'countriesByKidnapWithLocationsTop10',
                title: 'COUNTRIES MOST KIDNAPPED AT FURTHER ANALYZED BY GEO-LOCATION',
                service: function () {
                    return dataService.countriesByKidnapWithLocations({top: 10, from: null, to: null});
                }
            },
            {
                id: 'monthsByYears5',
                default: true,
                title: 'FIVE YEAR VIEW ON “NOVEMBER”',
                service: function () {
                    return dataService.monthsByYears({from: null, to: null});
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
    }]);
    
}(angular));
