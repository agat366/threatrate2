(function (angular) {
    'use strict';

    var controllerName = 'MainController';
    angular.module('tr').controller(controllerName, ['mainDataService', '$scope', 'repo.common',
        function (dataService, $scope, repo) {
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
                    return dataService.monthsByKidnap({from: '201601', to: '201612'});
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
                    return dataService.countriesByChildKidnap({top: 5, from: '201601', to: '201606'});
                }
            },
            {
                id: 'countriesByForeignersKidnapDurationTop5',
                title: '11 - List of 5 countries where kidnapped foreigners where held the longest // jan - oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnapDuration({top: 5, from: '201601', to: '201610'});
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
                    return dataService.regionsByVehicleAttack({from: '201501', to: '201512'});
                }
            },
            {
                id: 'countriesByForeignersKidnapTop10',
                title: '16 - List of 10 countries with highest kidnapping of foreigners // jan-oct 2016',
                service: function () {
                    return dataService.countriesByForeignersKidnap({top: 10, from: '201601', to: '201610'});
                }
            },
            {
                id: 'countriesByRansomTop5',
                title: '17 - Top 5 Countries with highest average ransom amount // jan-oct 2016',
                service: function () {
                    return dataService.countriesByRansom({top: 5, from: '201601', to: '201610'});
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
                    return dataService.countriesByKidnapWithLocations({top: 10, from: '201601', to: '201610'});
                }
            },
            {
                id: 'monthsByYears5',
                title: '20 - FIVE YEAR VIEW ON “NOVEMBER”',
                service: function () {
                    return dataService.monthsByYears({from: '201201', to: '201612'});
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
                    return dataService.countriesByKidnapDuration({top: 11, from: '201501', to: '201612'});
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
                    return dataService.ageGroupsByKidnapDuration({from: '201501', to: '201612'});
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
                    return dataService.countriesByForeignersVsLocalsKidnap({ top: 5, from: '201501', to: '201612' });
                }
            },
            {
//                default: true,
                id: 'countriesByForeignersVsLocalsKidnapTop10',
                title: '30 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION FOR SINGLE AND MULTIPLE KIDNAPPING',
                service: function () {
                    return dataService.countriesByForeignersVsLocalsKidnap({ top: 10, from: '201501', to: '201612'});
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
                var countries = [
                    {
                        id: '2',
                        w: 1247,
                        h: 800,
                        path: 'M349.705,113.159c0.03-0.164-0.046-0.277-0.104-0.428c-0.102-0.266-0.08-0.529,0.075-0.776c0.17-0.271,0.397-0.327,0.676-0.429l0,0c0.03,0.16-0.023,0.349-0.023,0.513c0,0.31,0.361,0.428,0.423,0.725c0.057,0.263-0.159,0.371-0.159,0.602l0,0l-0.292-0.028c-0.067,0.005-0.139,0.014-0.206,0.024c-0.041,0.005-0.101,0.012-0.141,0C349.848,113.331,349.781,113.229,349.705,113.159L349.705,113.159L349.705,113.159z'
                    },

];

                var sysCountries = repo.allCountries();
                _.each(countries,
                    function(c) {
                        var sys = _.find(sysCountries,
                            function(s) {
                                return s.id == c.id;
                            });
                        if (sys) {
                            c.name = sys.name;
                            c.id = sys.id;

                        } else {
                            console.log('not found:', c)
                        }
                    });
//                console.log(countries);

                var out = '';
                _.each(countries,
                    function(c) {
                        out += '        {\n';
                        out += '            name: \'' + c.name + '\',\n';
                        out += '            id: ' + c.id + ',\n';
                        out += '            path: \'' + c.path + '\',\n';
                        out += '            w: ' + c.w + ',\n';
                        out += '            h: ' + c.h + '\n';
                        out += '        },\n';
                    });
                vm.scr = out;
            };
            vm.processCountries();
        }]);
    
}(angular));
