﻿(function (angular) {
    'use strict';

    var controllerName = 'MainController';
    angular.module('tr').controller(controllerName, ['mainDataService', '$scope', 'repo.common', 'repo.regions', '$interpolate', 'storageService',
        function (dataService, $scope, repo, repoRegions, $interpolate, storageService) {

            var storageKey = 'infographics.v2';

            var token = null;
//            dataService.getToken(username, password).then(function(result) {
//                token = result.api_token;
//            });

        var vm = this;

        vm.isLoading = false;

            vm.months = [
                { id: 1, title: 'Jan', title2: 'January' },
                { id: 2, title: 'Feb' , title2: 'February' },
                { id: 3, title: 'Mar' , title2: 'March' },
                { id: 4, title: 'Apr' , title2: 'April' },
                { id: 5, title: 'May' , title2: 'May' },
                { id: 6, title: 'Jun' , title2: 'June' },
                { id: 7, title: 'Jul' , title2: 'July' },
                { id: 8, title: 'Aug' , title2: 'August' },
                { id: 9, title: 'Sep' , title2: 'September' },
                { id: 10, title: 'Oct', title2: 'October' },
                { id: 11, title: 'Nov', title2: 'November' },
                { id: 12, title: 'Dec', title2: 'December' }
        ];

            var yearsStart = 1990;

            vm.years = _.map(_.range(yearsStart, 2017), function (y) {
            return { id: y };
        });

        vm.filter = {};

        vm.filter.monthFrom = vm.months[0];
        vm.filter.monthTo = vm.months[vm.months.length - 1];
           
        vm.filter.yearFrom = _.find(vm.years, { id: 2015 });
        vm.filter.yearTo = _.find(vm.years, { id: 2016 });

        var regions = [{ name: '', title: 'Whole world' }];
        regions.push.apply(regions, repoRegions.allRegions());
        var regionsForTop5 = _.filter(regions, function (r) {
            return r.name !== 'namerica' && r.name !== 'oceania';
        });
        vm.regions = regions;

        vm.countries = repo.allCountries();
        vm.filter.country = vm.countries[0];

            vm.filter.region = vm.regions[0];

            vm.isRegionDisabled = function() {
                return !vm.currentChart || vm.currentChart.hasRegion === false;
            };
            vm.isCountriesVisible = function() {
                return vm.currentChart && vm.currentChart.hasCountries === true;
            };
        vm.charts = [
            {
                id: 'countriesByKidnap',
//                default: true,
//                title: '01 - Highest kidnap countries',
                hasRegion: false,
                title: 'KIDNAP RATE ACROSS WORLD COUNTRIES',
                service: function (params) {
                    params.top = 186;
                    return dataService.countriesByKidnap(params);
                }
            },
            {
                id: 'countriesByKidnapTop30',
                hasRegion: false,
                title: 'TOP 30 COUNTRIES WITH THE HIGHEST KIDNAP RATE',
//                title: '02 - Top 30 highest kidnap countries',
                service: function (params) {
                    params.top = 30;
                    return dataService.countriesByKidnap(params);
                }
            },
            {
                id: 'locationsByKidnap',
                default: false,
                hasRegion: false,
                title: 'GLOBAL  KIDNAP ACTIVITY BY LOCATION',
//                title: '03 - Kidnap activity by location // AUG 2015 - AUG 2016',
                service: function (params) {
                    return dataService.locationsByKidnap(params);
                }
            },
            {
                id: 'monthsByKidnap',
                default: false,
                hasFromMonth: false,
                hasToMonth: false,
                title: '3 MOST DANGEROUS MONTHS WITH HIGHEST KIDNAP ACTIVITY',
                titleHeader: '3 MOST DANGEROUS MONTHS {{vm.filter.region.name ? "in " + vm.filter.region.title : ""}} WITH HIGHEST {{vm.filter.region.name ? "" : "GLOBAL"}} KIDNAP ACTIVITY',
//                title: '04 - Most dangerous months',
                service: function (params) {
                    return dataService.monthsByKidnap(params);
                }
            },
            {
                id: 'ageGroupsByKidnap',
                hasRegion: false,
                title: 'GLOBAL  KIDNAP ACTIVITY ACROSS AGE GROUPS',
//                title: '05 - Age Groups by Kidnapping',
//                default: true,
                service: function (params) {
                    return dataService.ageGroupsByKidnap(params);
                }
            },
            {
                id: 'professionalGroupsByKidnap',
                title: 'KIDNAP ACTIVITY ACROSS PROFESSIONAL GROUPS',
                titleHeader: '{{vm.filter.region.name ? "" : "GLOBAL"}}  KIDNAP ACTIVITY {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} ACROSS PROFESSIONAL GROUPS', // todo: change the month to check
//                title: '06 - Professional Groups by Kidnapping',
                default: false,
                service: function (params) {
                    return dataService.professionalGroupsByKidnap(params);
                }
            },
            {
                id: 'regionsByKidnapSimpleVsMultiple',
                title: 'GLOBAL DISTRIBUTION OF SINGLE VERSUS MULTIPLE KIDNAPPED VICTIMS',
//                title: '07 - SINGLE VERSUS MULTIPLE KIDNAPPING ACTIVITY // 2015',
                default: false,
                hasRegion: false,
                service: function (params) {
                    return dataService.regionsByKidnapSimpleVsMultiple(params);
                }
            },
            {
                id: 'countriesByLongestKidnapDurationTop3',
//                default: true,
                title: 'TOP 3 COUNTRIES WHERE KIDNAPED VICTIMS WERE HELD THE LONGEST',
                titleHeader: '{{vm.filter.region.name == "namerica" ? "How long were kidnap victims held in America " : "TOP 3 COUNTRIES " + (vm.filter.region.name ? "IN " + vm.filter.region.title : "") + " WHERE KIDNAPED VICTIMS WERE HELD THE LONGEST"}} ',
//                title: '08 - TOP 3 COUNTRIES WHERE KIDNAPPING VICTIMS WERE HELD THE LONGEST // Q1-Q2/2016',
                service: function (params) {
                    params.top = 3;
                    return dataService.countriesByKidnapDuration(params);
                }
            },
            {
                id: 'countriesByVehicleAttackTop3',
//                default: true,
                title: 'TOP 3 COUNTRIES WITH THE HIGHEST NUMBER OF VEHICLE ATTACKS',
                titleHeader: 'TOP 3 COUNTRIES WITH THE HIGHEST NUMBER OF VEHICLE ATTACKS {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '09 - TOP 3 COUNTRIES WITH THE HIGHEST NUMBER OF VEHICLE ATTACKS // Q1-Q2/2016',
                service: function (params) {
                    params.top = 3;
                    return dataService.countriesByVehicleAttack(params);
                }
            },
            {
                id: 'countriesByChildKidnapTop5',
//                default: true,
                isTop5: true,
                title: 'TOP 5 COUNTRIES WITH THE HIGHEST RATE OF CHILD KIDNAPPING',
                titleHeader: 'TOP 5 COUNTRIES {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH THE HIGHEST RATE OF CHILD KIDNAPPING',
//                title: '10 - TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF CHILD KIDNAPPINGS // Q1-Q2/2016',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByChildKidnap(params);
                }
            },
            {
                id: 'countriesByForeignersKidnapDurationTop5',
                isTop5: true,
                title: 'TOP 5 COUNTRIES WHERE KIDNAPPED FOREIGNERS WHERE HELD THE LONGEST',
                titleHeader: 'TOP 5 COUNTRIES  {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WHERE KIDNAPPED FOREIGNERS WHERE HELD THE LONGEST',
//                title: '11 - List of 5 countries where kidnapped foreigners where held the longest // jan - oct 2016',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByForeignersKidnapDuration(params);
                }
            },
            {
                id: 'countriesByUnrestTop5',
//                default: true,
                isTop5: true,
                title: 'TOP 5 COUNTRIES WITH THE HIGHEST CIVIL UNREST ACTIVITY',
                titleHeader: 'TOP 5 COUNTRIES {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH THE HIGHEST CIVIL UNREST ACTIVITY',
//                title: '12 - List of 5 countries registered the most civil unrest events // 2016',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByUnrest(params);
                }
            },
            {
                id: 'countriesBySuicideAttackTop5',
//                default: true,
                isTop5: true,
                title: 'TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF SUICIDE BOMBING ATTACKS',
                titleHeader: 'TOP 5 COUNTRIES {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH THE LARGEST NUMBER OF SUICIDE BOMBING ATTACKS',
//                title: '13 - TOP 5 COUTRSIES WITH THE LARGEST NUMBER OF SUICIDE BOMBING ATTACKS // Q2/2011-Q2/2016',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesBySuicideAttack(params);
                }
            },
            {
                id: 'countriesByKidnapKilledTop5',
                isTop5: true,
                title: 'TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF KIDNAPPING VICTIMS KILLED',
                titleHeader: 'TOP 5 COUNTRIES {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH THE LARGEST NUMBER OF KIDNAPPING VICTIMS KILLED',
//                title: '14 - TOP 5 COUNTRIES WITH THE LARGEST NUMBER OF KIDNAPPING VICTIMS KILLED // 2015',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByKidnapKilled(params);
                }
            },
            {
                id: 'regionsByVehicleAttack',
                hasRegion: false,
                title: 'VEHICLE ATTACK ACTIVITY ACROSS REGIONS',
//                title: '15 - VEHICLE ATTACKS ACTIVITY ACROSS REGIONS // 2015',
                service: function (params) {
                    return dataService.regionsByVehicleAttack(params);
                }
            },
            {
                id: 'countriesByForeignersKidnapTop10',
                hasRegion: false,
                title: 'TOP 10 COUNTRIES WITH HIGHEST KIDNAPPING OF FOREIGNERS',
//                title: '16 - List of 10 countries with highest kidnapping of foreigners // jan-oct 2016',
                service: function (params) {
                    return dataService.countriesByForeignersKidnap(params);
                }
            },
            {
                id: 'countriesByRansomTop5',
                isTop5: true,
                title: 'TOP 5 COUNTRIES WITH THE HIGHEST AVERAGE RANSOM AMOUNT PAID',
//                title: '17 - Top 5 Countries with highest average ransom amount // jan-oct 2016',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByRansom(params);
                }
            },
            {
                id: 'terroristAttackTypes',
//                default: true,
                title: 'FREQUENCY OF TERRORIST ATTACK TYPES ',
                titleHeader: 'FREQUENCY OF TERRORIST ATTACK TYPES {{vm.filter.region.name ? "IN " + vm.filter.region.title : "GLOBALLY"}} ',
//                title: '18 - FREQUENCY OF TERRORIST ATTACK TYPES // 2016',
                service: function (params) {
                    return dataService.terroristAttackTypes(params);
                }
            },
            {
                id: 'countriesByKidnapWithLocationsTop10',
                title: 'GEO-LOCATION ANALYSIS FOR TOP 10 COUNTRIES WITH HIGHEST KIDNAP RATE',
                titleHeader: 'GEO-LOCATION ANALYSIS FOR TOP 10 COUNTRIES {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH HIGHEST KIDNAP RATE',
//                title: '19 - COUNTRIES MOST KIDNAPPED AT FURTHER ANALYZED BY GEO-LOCATION',
                service: function (params) {
                    params.top = 10;
                    return dataService.countriesByKidnapWithLocations(params);
                }
            },
            {
                id: 'monthsByYears5',
                hasFrom: false,
                yearsOnly: true,
                title: 'FIVE YEAR ANALYSIS OF KIDNAP ACTIVITY PER MONTH',
                titleHeader: 'FIVE YEAR ANALYSIS OF KIDNAP ACTIVITY  {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} DURING {{vm.filter.monthTo.title2}}', // todo: change the month to check
//                title: '20 - FIVE YEAR VIEW ON “NOVEMBER”',
                service: function (params) {
                    return dataService.monthsByYears(params);
                }
            },
            {
                id: 'countriesByKidnapByGender',
                title: 'GENDER ANALYSIS FOR COUNTRIES WITH HIGHEST KIDNAPPING RATE',
                titleHeader: 'GENDER ANALYSIS FOR COUNTRIES  {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}} WITH HIGHEST KIDNAPPING RATE',
//                title: '21 - Countries most kidnapped at by gender// June 2010 - March 2017',
//                default: true,
                service: function (params) {
                    params.top = 11;
                    return dataService.countriesByKidnapByGender(params);
                }
            },
            {
                id: 'locationsByKidnapByGender',
//                default: true,
                title: 'GENDER ANALYSIS FOR  KIDNAPPING BY LOCATION',
                titleHeader: 'GENDER ANALYSIS FOR  KIDNAPPING BY LOCATION {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '22 - IS THERE A DIFFERENCE WHERE WOMEN GET KIDNAPPED FROM VERSUS MAN',
                service: function (params) {
//                    params.top = 3;
                    return dataService.locationsByKidnapByGender(params);
                }
            },
            {
                id: 'countriesByKidnapDurationTop10',
                title: 'CROSS-CONTRY ANALYSIS OF KIDNAP DURATION, ACTIVITY LEVEL AND RANSOM PAID',
//                title: '23 - Countries by kidnap duration and ransom',
//                default: true,
                hasCountries: true,
                service: function (params) {
                    
                    var country = vm.filter.country;
                    params.top = 10;
                    return dataService.countriesByKidnapDurationWithComparer(params)
                        .then(function (data) {
                            vm.comparer = data.comparer || { id: country.id, title: country.title, ransom: 0, duration: 0, value: 0 };
                            return data.data;
                        });
                }
            },
            {
                id: 'countriesByKidnapDurationGridTop10',
                title: 'TOP 10 COUNTRIES  WITH HIGHEST KIDNAP DURATION AND RANSOM PAID',
                hasRegion: false,
//                title: '24 - KIDNAP DURATION AND RANSOM FOR THE TOP 10 COUNTRIES',
                service: function (params) {
                    params.top = 10;
                    return dataService.countriesByKidnapDuration(params);
                }
            },
            {
                id: 'ageGroupsByKidnapDurationGrid',
//                default: true,
                title: 'KIDNAP DURATION AND RANSOM PAID ACROSS AGE GROUPS',
                titleHeader: '{{vm.filter.region.name ? "" : "GLOBAL VIEW "}} OF KIDNAP DURATION AND RANSOM PAID ACROSS AGE GROUPS {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '25 - KIDNAP DURATION AND RANSOM AMOUNT CORRELATION WITH AGE',
                service: function (params) {
                    return dataService.ageGroupsByKidnapDuration(params);
                }
            },
            {
                id: 'kidnapResults',
                hasFrom: false,
                title: 'FIVE YEAR ANALYSIS OF KIDNAP RESULTS BY REGION',
                titleHeader: 'FIVE YEAR ANALYSIS OF KIDNAP RESULTS in {{!vm.filter.region.name ? \'the world\' : vm.filter.region.title}}',
//                title: '26 - KIDNAP RESULTS - KILLED, RELEASED, ESCAPED, RESCUED',
                service: function (params) {
                    return dataService.kidnapResults(params);
                }
            },
            {
                id: 'regionsByKidnapDurationSimpleVsMultiple',
//                default: true,
                hasRegion: false,
                title: 'REGIONAL VIEW OF KIDNAP DURATION AND RANSOM PAID FOR SINGLE VS. MULTIPLE VICTIMS',
                titleHeader: 'REGIONAL VIEW OF KIDNAP DURATION AND RANSOM PAID FOR SINGLE VS. MULTIPLE VICTIMS {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '27 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION FOR SINGLE AND MULTIPLE KIDNAPPING',
                service: function (params) {
                    return dataService.regionsByKidnapDurationSimpleVsMultiple(params);
                }
            },
            {
                id: 'regionsByKidnapDurationAndRansom',
                hasRegion: false,
                title: 'REGIONAL VIEW OF KIDNAP DURATION AND RANSOM PAID',
//                title: '28 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION',
//                default: true,
                service: function (params) {
                    return dataService.regionsByKidnapDurationRange(params);
                }
            },
            {
                id: 'countriesByForeignersVsLocalsKidnapTop5',
//                default: true,
//                isTop5: true,
                hasRegion: false,
                title: 'TOP 5 COUNTRIES FOR FOREIGNERS KIDNAPPING  VS. TOP 5 COUNTRIES FOR LOCALS KIDNAPPING',
                titleHeader: 'TOP 5 COUNTRIES FOR FOREIGNERS KIDNAPPING  VS. TOP 5 COUNTRIES FOR LOCALS KIDNAPPING {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '29 - TOP 5 COUNTRIES FOR FOREIGNERS KIDNAPPING VERSUS TOP 5 COUNTRIES FOR LOCALS KIDNAPPINGS',
                service: function (params) {
                    params.top = 5;
                    return dataService.countriesByForeignersVsLocalsKidnap(params);
                }
            },
            {
//                default: true,
                id: 'countriesByForeignersVsLocalsKidnapTop10',
                hasRegion: false,
                title: 'TOP 10 COUNTRIES FOR FOREIGNERS KIDNAPPING  VS. TOP 10 COUNTRIES FOR LOCALS KIDNAPPING',
                titleHeader: 'TOP 10 COUNTRIES FOR FOREIGNERS KIDNAPPING  VS. TOP 10 COUNTRIES FOR LOCALS KIDNAPPING {{vm.filter.region.name ? "IN " + vm.filter.region.title : ""}}',
//                title: '30 - REGIONAL VIEW FOR KIDNAP DURATION AND RANSOM AMOUNT CORRELATION FOR SINGLE AND MULTIPLE KIDNAPPING',
                service: function (params) {
                    params.top = 10;
                    return dataService.countriesByForeignersVsLocalsKidnap(params);
                }
            }/*,
            {
//                default: true,
                id: 'countriesTest',
                title: '-- - Countries test',
                service: function (params) {
                    vm.isLoading = false;
                    return { then: function () { } };
                }
            }*/
        ];

        var prevSettings = storageService.getValue(storageKey);
            if (prevSettings) {
                var defaultChart = _.find(vm.charts, { id: prevSettings.defaultChartId });
                if (defaultChart) {
                    _.each(vm.charts, function(ch) {
                        ch.default = false;
                    });
                    defaultChart.default = true;
                }
            }

        _.each(vm.charts, function(ch, i) {
            ch.order = i + 1;
            ch.title2 = ch.order + ' - ' + ch.title;
        });

        vm.currentChart = _.find(vm.charts, { default: true }) || vm.charts[0];

        vm.reload = function() {
            loadData();
        };

        $scope.$watch('vm.currentChart', loadData);
        $scope.$watch('vm.filter', loadData, true);

        function loadData() {
            vm.isLoading = true;
            if (vm.currentChart) {

                storageService.setValue(storageKey, vm.currentChart.id, 'defaultChartId');

                var title = vm.currentChart.titleHeader || vm.currentChart.title;
                var exp = $interpolate(title);
                vm.currentTitle = exp($scope);

                vm.data = null;
                vm.chartId = vm.currentChart.id;

                vm.regions = vm.currentChart.isTop5 ? regionsForTop5 : regions;
                if (!_.find(vm.regions, { name: vm.filter.region.name })) {
                    vm.filter.region = regions[0];
                }
                // setup filter values

                if (vm.currentChart.id === 'monthsByYears5') {
                    var yearTo = vm.filter.yearTo;
                    if (yearTo.id - 4 < yearsStart) {
                        vm.filter.yearFrom = _.find(vm.years, { id: yearsStart });
                        vm.filter.yearTo = _.find(vm.years, { id: yearsStart + 4 });
                    } else {
                        vm.filter.yearFrom = _.find(vm.years, { id: yearTo.id - 4 });
                    }
//                    vm.filter.monthFrom = _.find(vm.months, { id: 1 });
//                    vm.filter.monthTo = _.find(vm.months, { id: 12 });
                }
                if (vm.currentChart.hasRegion === false) {
                    vm.filter.region = regions[0];
                }

                if (vm.currentChart.hasFrom !== false && vm.filter.yearFrom.id > vm.filter.yearTo.id) {
                    vm.filter.yearTo = vm.filter.yearFrom;
                }
                if (vm.currentChart.hasFrom !== false && vm.filter.yearFrom.id === vm.filter.yearTo.id && vm.filter.monthFrom.id > vm.filter.monthTo.id) {
                    vm.filter.monthTo = vm.filter.monthFrom;
                }

                if (vm.currentChart.hasToMonth === false) {
                    vm.filter.monthTo = vm.months[vm.months.length - 1];
                }
                if (vm.currentChart.hasFromMonth === false) {
                    vm.filter.monthFrom = vm.months[0];
                }

                // setup params
                var from = '' +
                    vm.filter.yearFrom.id +
                    (vm.filter.monthFrom.id < 10 ? '0' : '') +
                    (vm.filter.monthFrom.id);
                var to = '' +
                    vm.filter.yearTo.id +
                    (vm.filter.monthTo.id < 10 ? '0' : '') +
                    (vm.filter.monthTo.id);

                var regionName = vm.filter.region.name;

                var params = {
                    from: from,
                    to: to
                };

                if (regionName) {
                    params.region = regionName;
                }

                if (vm.currentChart.hasCountries === true) {
                    params.country = vm.filter.country.id;
                }

                renderDate();

                vm.comparer = null;
                vm.currentChart.service(params)
                    .then(function(data) {
                        vm.data = data;
                        vm.isLoading = false;
                    });
            } else {
                vm.currentTitle = '';
                vm.isLoading = false;
            }
        }

        function renderDate() {

            var includeMonth = vm.currentChart.yearsOnly !== true;
            var sameYear = false;
            var monthFrom = parseInt(vm.filter.monthFrom.id);
            var monthTo = parseInt(vm.filter.monthTo.id);
            var yearFrom = parseInt(vm.filter.yearFrom.id);
            var yearTo = parseInt(vm.filter.yearTo.id);

            var monthsAsQuarters = monthFrom % 3 === 1 && monthTo % 3 === 0
                && (monthTo + yearTo * 12) - (monthFrom + yearFrom * 12) > 3;

            if (monthFrom === 1 && monthTo === 12) {
                includeMonth = false;
            }

            if (yearFrom === yearTo) {
                sameYear = true;
            }

            vm.renderedFrom = null;
            vm.renderedTo = null;

            if (vm.currentChart.order === 20 || vm.currentChart.order === 26) {
                vm.renderedYears = 5;
            } else {
                vm.renderedYears = Math.round(((yearTo * 12 + monthTo) - (yearFrom * 12 + monthFrom)) / 12 + .5);
            }

            vm.renderedFrom = sameYear && !includeMonth ? null :
                ((includeMonth ? renderQuarter(monthFrom, monthsAsQuarters) + '/' : '') + yearFrom);
            vm.renderedTo = (includeMonth ? renderQuarter(monthTo, monthsAsQuarters, true) + '/' : '') + yearTo;

            function renderQuarter(month, asQuarter, isTo) {
                if (asQuarter) {
                    return 'Q' + (Math.round(month / 3 - .5) + (isTo ? 0 : 1));
                } else {
                    return month;
                }
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
