(function () {
    'use strict';
    var serviceId = 'repo.common';
    angular
        .module('tr')
        .service(serviceId,
        [
            'data', 'common',
            function(dataContext, common) {

                var context = dataContext.context({
                    controller: 'v1'
                });


                var titles = prepareCountryTitles();

                function prepareCountryTitles() {
                    // list of countries from server
                    var _titles = getCountriesInitialList();

                    var systemCountries = _.map(_titles, function (c) {
                        return { title: c[1], id: c[0] };
                    });

                    (_.find(systemCountries, { id: 11 }) || {}).alternateTitle = 'Republic of Serbia';
                    (_.find(systemCountries, { id: 24 }) || {}).alternateTitle = 'The Bahamas';
                    (_.find(systemCountries, { id: 74 }) || {}).alternateTitle = 'Democratic Republic of the Congo';
                    (_.find(systemCountries, { id: 82 }) || {}).alternateTitle = 'Republic of Congo';
                    (_.find(systemCountries, { id: 198 }) || {}).alternateTitle = 'Liechtenstein'; // mistyping in sources
                    (_.find(systemCountries, { id: 198 }) || {}).title = 'Liechtenstein'; // mistyping in sources
                    (_.find(systemCountries, { id: 152 }) || {}).alternateTitle = 'United Republic of Tanzania';
                    (_.find(systemCountries, { id: 178 }) || {}).alternateTitle = 'East Timor';
                    (_.find(systemCountries, { id: 55 }) || {}).alternateTitle = 'United States of America';


                    var countries = getSvgCountries();

                    var notFound = [];
                    _.each(systemCountries, function (sys) {
                        var correspondence = _.find(countries, function (c) {
                            var title = c.title.toLowerCase();
                            return title === sys.title.toLowerCase()
                                || title === (sys.alternateTitle || '').toLowerCase();
                        });

                        if (!correspondence) {
                            notFound.push(sys);
                        } else {
                            sys.name = correspondence.iso2.toLowerCase();
                        }
                    });

                    if (notFound.length) {
                        console.log('Not detected countries', notFound);                        
                    }

                    return systemCountries;
                }

                var unrest = [
                    { title: 'Terrorism' },
                    { title: 'Rebel activity' },
                    { title: 'Racially motivated' },
                    { title: 'Politically motivated' },
                    { title: 'Financially motivated' },
                    { title: 'Ideologically motivated' },
                    { title: 'Sectarian' },
                    { title: 'Religious motivated' },
                    { title: 'Coup/Mutiny' },
                    { title: 'Civil war' }
                ];
                var $q = common.$q;

                function renderList(n, iterator) {
                    var result = [];
                    for (var i = 0; i < n; i++) {
                        result.push(iterator(i));
                    }
                    return result;
                }

                function allCountries() {
                    return angular.copy(titles);
                }

                function countriesByKidnapDuration(params) {
                    params.include = 'duration,ransom';
                    return countriesByKidnap(params, true);
                }

                function countriesByVehicleAttack(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesByChildKidnap(params) {
                    // todo: countries by custom filters
                    params.filter = 'children';
                    return countriesByKidnap(params, true);
                }

                function countriesByForeignersKidnapDuration(params) {
                    params.filter = 'foreigners';
                    params.include = 'duration';

                    return countriesByKidnap(params, true);
                }

                function countriesByForeignersKidnap(params) {
                    params.filter = 'foreigners';

                    return countriesByKidnap(params, true);
                }
                function countriesByRansom(params) {

                    params.include = 'ransom';
                    return countriesByKidnap(params, true);
                }
                function countriesByLocalsKidnap(params) {
                    params.filter = 'locals';
                    return countriesByKidnap(params, true);
                }

                function countriesByKidnapWithLocations(params) {
                    params.include = 'locations';
                    return countriesByKidnap(params, true);
                }

                function countriesByKidnapByGender(params) {
                    params.include = 'males,females';
                    // todo: countries by custom filters
                    return countriesByKidnap(params, true);
                }

                function countriesByUnrest(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesBySuicideAttack(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesByKidnapKilled(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function mapItemId(country) {
                    var sysCountry = _.find(titles, function(c) { return c.id == country.id; });
                    if (sysCountry) {
                        return sysCountry.name;
                    }
                    return 'id' + country.id;
                }

                function countriesByKidnap(params, liveData) {
                    params = params || {};

                    var def = $q.defer();

                    params.id = params.from || '199001';
                    params.id2 = params.to || '201801';

                    params.from = null;
                    params.to = null;

                    context.get(liveData ? 'countriesByKidnap' : 'prevent-loading-not-live', params)
                        .then(function (result) {
                            _.each(result, function(r) {
                                r.name = mapItemId(r);
                            });
                            def.resolve(result);
                        }).catch(function () {
                            var top = params.top || 200;
                            var result = renderList(top, function (n) {
                                var rnd = Math.random();
                                var id;
                                var titleObj;
                                do {
                                    id = Math.round(Math.random() * 190);
                                    titleObj = _.find(titles, { id: id });
                                }
                                while (!titleObj);

                                var title = titleObj.title || '-';
                                var name = titleObj.name || title.toLowerCase();
                                return {
                                    value: Math.round(rnd * 200),
                                    name: name,
                                    title: title,
                                    duration: Math.round(Math.random() * 10),
                                    ransom: Math.round(Math.random() * 20),
                                    locations: [
                                        {
                                            value: Math.round(Math.random() * 150),
                                            title: 'Ottawa'
                                        },
                                        {
                                            value: Math.round(Math.random() * 200),
                                            title: 'Vancouver'
                                        },
                                        {
                                            value: Math.round(Math.random() * 20),
                                            title: 'Toronto'
                                        }
                                    ],
                                    males: Math.round(Math.random() * 150),
                                    females: Math.round(Math.random() * 50),
                                    unrest_categories: _.map(unrest, function(u) {
                                        return {
                                            title: u,
                                            name: u,
                                            value: Math.random() < .8 ? 0 : Math.round(Math.random() * 80)
                                        };
                                    })
                                }
                            });
                            def.resolve(result);
                        });

                    return def.promise;
                }
                
//                    var def = $q.defer();
//                    def.resolve({ data: dataRequest || 'ok' });
//                    return def.promise;


                this.allCountries = allCountries;

                this.countriesByKidnap = countriesByKidnap;
                this.countriesByKidnapDuration = countriesByKidnapDuration;
                this.countriesByVehicleAttack = countriesByVehicleAttack;
                this.countriesByChildKidnap = countriesByChildKidnap;
                this.countriesByForeignersKidnapDuration = countriesByForeignersKidnapDuration;
                this.countriesByForeignersKidnap = countriesByForeignersKidnap;
                this.countriesByRansom = countriesByRansom;
                this.countriesByLocalsKidnap = countriesByLocalsKidnap;
                this.countriesByKidnapWithLocations = countriesByKidnapWithLocations;
                this.countriesByKidnapByGender = countriesByKidnapByGender;
                this.countriesByUnrest = countriesByUnrest;
                this.countriesBySuicideAttack = countriesBySuicideAttack;
                this.countriesByKidnapKilled = countriesByKidnapKilled;
                function getCountriesInitialList() {
                    var _countries = [
                        [
                            3,
                            "Afghanistan"
                        ],
                        [
                            14,
                            "Albania"
                        ],
                        [
                            17,
                            "Algeria"
                        ],
                        [
                            204,
                            "Andorra"
                        ],
                        [
                            18,
                            "Angola"
                        ],
                        [
                            19,
                            "Argentina"
                        ],
                        [
                            20,
                            "Armenia"
                        ],
                        [
                            21,
                            "Australia"
                        ],
                        [
                            22,
                            "Austria"
                        ],
                        [
                            132,
                            "Azerbaijan"
                        ],
                        [
                            24,
                            "Bahamas"
                        ],
                        [
                            25,
                            "Bahrain"
                        ],
                        [
                            8,
                            "Bangladesh"
                        ],
                        [
                            27,
                            "Barbados"
                        ],
                        [
                            130,
                            "Belarus"
                        ],
                        [
                            28,
                            "Belgium"
                        ],
                        [
                            145,
                            "Belize"
                        ],
                        [
                            7,
                            "Benin"
                        ],
                        [
                            31,
                            "Bhutan"
                        ],
                        [
                            70,
                            "Bolivia"
                        ],
                        [
                            33,
                            "Bosnia and Herzegovina"
                        ],
                        [
                            34,
                            "Botswana"
                        ],
                        [
                            35,
                            "Brazil"
                        ],
                        [
                            36,
                            "Brunei"
                        ],
                        [
                            37,
                            "Bulgaria"
                        ],
                        [
                            38,
                            "Burkina Faso"
                        ],
                        [
                            39,
                            "Burundi"
                        ],
                        [
                            81,
                            "Cambodia"
                        ],
                        [
                            108,
                            "Cameroon"
                        ],
                        [
                            93,
                            "Canada"
                        ],
                        [
                            172,
                            "Cape Verde"
                        ],
                        [
                            109,
                            "Central African Republic"
                        ],
                        [
                            94,
                            "Chad"
                        ],
                        [
                            78,
                            "Chile"
                        ],
                        [
                            46,
                            "China"
                        ],
                        [
                            56,
                            "Colombia"
                        ],
                        [
                            175,
                            "Comoros"
                        ],
                        [
                            118,
                            "Costa Rica"
                        ],
                        [
                            142,
                            "Croatia"
                        ],
                        [
                            176,
                            "Cuba"
                        ],
                        [
                            127,
                            "Cyprus"
                        ],
                        [
                            101,
                            "Czech Republic"
                        ],
                        [
                            74,
                            "Democratic Republic of Congo"
                        ],
                        [
                            116,
                            "Denmark"
                        ],
                        [
                            174,
                            "Djibouti"
                        ],
                        [
                            177,
                            "Dominica"
                        ],
                        [
                            71,
                            "Dominican Republic"
                        ],
                        [
                            57,
                            "Ecuador"
                        ],
                        [
                            87,
                            "Egypt"
                        ],
                        [
                            102,
                            "El Salvador"
                        ],
                        [
                            165,
                            "Equatorial Guinea"
                        ],
                        [
                            120,
                            "Eritrea"
                        ],
                        [
                            117,
                            "Estonia"
                        ],
                        [
                            110,
                            "Ethiopia"
                        ],
                        [
                            115,
                            "Fiji"
                        ],
                        [
                            146,
                            "Finland"
                        ],
                        [
                            136,
                            "France"
                        ],
                        [
                            6,
                            "Gabon"
                        ],
                        [
                            139,
                            "Gambia"
                        ],
                        [
                            73,
                            "Georgia"
                        ],
                        [
                            129,
                            "Germany"
                        ],
                        [
                            80,
                            "Ghana"
                        ],
                        [
                            65,
                            "Greece"
                        ],
                        [
                            195,
                            "Grenada"
                        ],
                        [
                            5,
                            "Guatemala"
                        ],
                        [
                            126,
                            "Guinea"
                        ],
                        [
                            186,
                            "Guinea Bissau"
                        ],
                        [
                            106,
                            "Guyana"
                        ],
                        [
                            58,
                            "Haiti"
                        ],
                        [
                            72,
                            "Honduras"
                        ],
                        [
                            196,
                            "Hungary"
                        ],
                        [
                            197,
                            "Iceland"
                        ],
                        [
                            47,
                            "India"
                        ],
                        [
                            63,
                            "Indonesia"
                        ],
                        [
                            68,
                            "Iran"
                        ],
                        [
                            54,
                            "Iraq"
                        ],
                        [
                            91,
                            "Ireland"
                        ],
                        [
                            12,
                            "Israel"
                        ],
                        [
                            52,
                            "Italy"
                        ],
                        [
                            167,
                            "Ivory Coast"
                        ],
                        [
                            59,
                            "Jamaica"
                        ],
                        [
                            99,
                            "Japan"
                        ],
                        [
                            164,
                            "Jordan"
                        ],
                        [
                            143,
                            "Kazakhstan"
                        ],
                        [
                            96,
                            "Kenya"
                        ],
                        [
                            157,
                            "Kosovo"
                        ],
                        [
                            148,
                            "Kuwait"
                        ],
                        [
                            124,
                            "Kyrgyzstan"
                        ],
                        [
                            86,
                            "Laos"
                        ],
                        [
                            134,
                            "Latvia"
                        ],
                        [
                            84,
                            "Lebanon"
                        ],
                        [
                            187,
                            "Lesotho"
                        ],
                        [
                            151,
                            "Liberia"
                        ],
                        [
                            16,
                            "Libya"
                        ],
                        [
                            198,
                            "Liechenstein"
                        ],
                        [
                            154,
                            "Lithuania"
                        ],
                        [
                            2,
                            "Luxembourg"
                        ],
                        [
                            138,
                            "Macedonia"
                        ],
                        [
                            160,
                            "Madagascar"
                        ],
                        [
                            173,
                            "Malawi"
                        ],
                        [
                            64,
                            "Malaysia"
                        ],
                        [
                            147,
                            "Maldives"
                        ],
                        [
                            90,
                            "Mali"
                        ],
                        [
                            199,
                            "Malta"
                        ],
                        [
                            1,
                            "Mauritania"
                        ],
                        [
                            188,
                            "Mauritius"
                        ],
                        [
                            40,
                            "Mexico"
                        ],
                        [
                            200,
                            "Moldova"
                        ],
                        [
                            201,
                            "Monaco"
                        ],
                        [
                            182,
                            "Mongolia"
                        ],
                        [
                            202,
                            "Montenegro"
                        ],
                        [
                            41,
                            "Morocco"
                        ],
                        [
                            149,
                            "Mozambique"
                        ],
                        [
                            181,
                            "Myanmar"
                        ],
                        [
                            159,
                            "Namibia"
                        ],
                        [
                            190,
                            "Nauru"
                        ],
                        [
                            76,
                            "Nepal"
                        ],
                        [
                            66,
                            "Netherlands"
                        ],
                        [
                            48,
                            "New Zealand"
                        ],
                        [
                            85,
                            "Nicaragua"
                        ],
                        [
                            123,
                            "Niger"
                        ],
                        [
                            42,
                            "Nigeria"
                        ],
                        [
                            162,
                            "North Korea"
                        ],
                        [
                            100,
                            "Norway"
                        ],
                        [
                            150,
                            "Oman"
                        ],
                        [
                            49,
                            "Pakistan"
                        ],
                        [
                            191,
                            "Palau"
                        ],
                        [
                            205,
                            "Palestinian Territories"
                        ],
                        [
                            107,
                            "Panama"
                        ],
                        [
                            104,
                            "Papua New Guinea"
                        ],
                        [
                            88,
                            "Paraguay"
                        ],
                        [
                            4,
                            "Peru"
                        ],
                        [
                            50,
                            "Philippines"
                        ],
                        [
                            97,
                            "Poland"
                        ],
                        [
                            113,
                            "Portugal"
                        ],
                        [
                            133,
                            "Qatar"
                        ],
                        [
                            82,
                            "Republic of the Congo"
                        ],
                        [
                            183,
                            "Romania"
                        ],
                        [
                            62,
                            "Russia"
                        ],
                        [
                            114,
                            "Rwanda"
                        ],
                        [
                            193,
                            "Samoa"
                        ] ,
                        [
                            180,
                            "Sao Tome and Principe"
                        ],
                        [
                            121,
                            "Saudi Arabia"
                        ],
                        [
                            163,
                            "Senegal"
                        ],
                        [
                            11,
                            "Serbia"
                        ] ,
                        [
                            156,
                            "Seychelles"
                        ],
                        [
                            140,
                            "Sierra Leone"
                        ],
                        [
                            92,
                            "Singapore"
                        ],
                        [
                            128,
                            "Slovakia"
                        ],
                        [
                            203,
                            "Slovenia"
                        ],
                        [
                            185,
                            "Solomon Islands"
                        ],
                        [
                            43,
                            "Somalia"
                        ],
                        [
                            44,
                            "South Africa"
                        ],
                        [
                            112,
                            "South Korea"
                        ],
                        [
                            168,
                            "South Sudan"
                        ],
                        [
                            67,
                            "Spain"
                        ],
                        [
                            51,
                            "Sri Lanka"
                        ],
                        [
                            45,
                            "Sudan"
                        ],
                        [
                            79,
                            "Suriname"
                        ],
                        [
                            166,
                            "Swaziland"
                        ],
                        [
                            89,
                            "Sweden"
                        ],
                        [
                            83,
                            "Switzerland"
                        ],
                        [
                            137,
                            "Syria"
                        ],
                        [
                            77,
                            "Taiwan"
                        ],
                        [
                            131,
                            "Tajikistan"
                        ],
                        [
                            152,
                            "Tanzania"
                        ],
                        [
                            95,
                            "Thailand"
                        ],
                        [
                            178,
                            "Timor Leste"
                        ],
                        [
                            153,
                            "Togo"
                        ],
                        [
                            192,
                            "Tonga"
                        ],
                        [
                            61,
                            "Trinidad and Tobago"
                        ],
                        [
                            111,
                            "Tunisia"
                        ],
                        [
                            53,
                            "Turkey"
                        ],
                        [
                            171,
                            "Turkmenistan"
                        ],
                        [
                            194,
                            "Tuvalu"
                        ],
                        [
                            75,
                            "Uganda"
                        ],
                        [
                            125,
                            "Ukraine"
                        ],
                        [
                            105,
                            "United Arab Emirates"
                        ],
                        [
                            144,
                            "United Kingdom"
                        ],
                        [
                            55,
                            "United States"
                        ],
                        [
                            122,
                            "Uruguay"
                        ],
                        [
                            135,
                            "Uzbekistan"
                        ],
                        [
                            169,
                            "Vanuatu"
                        ],
                        [
                            170,
                            "Vatican"
                        ],
                        [
                            60,
                            "Venezuela"
                        ],
                        [
                            119,
                            "Vietnam"
                        ],
                        [
                            184,
                            "Western Sahara"
                        ],
                        [
                            69,
                            "Yemen"
                        ],
                        [
                            103,
                            "Zambia"
                        ],
                        [
                            161,
                            "Zimbabwe"
                        ]
                    ];
                    return _countries;
                }

                function getSvgCountries() {
                    var countries = [];

                    countries.push({
                        title: 'Faroe Islands',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'FO',
                        iso3: 'FRO',
                        continent: 'Europe',
                        key: 'fo',
                    });

                    countries.push({
                        title: 'United States Minor Outlying Islands',
                        rank: '5',
                        region: 'East Asia & Pacific',
                        subregion: 'Seven seas (open ocean)',
                        iso2: 'UM',
                        iso3: 'UMI',
                        continent: 'North America',
                        key: 'um',
                    });

                    countries.push({
                        title: 'United States of America',
                        rank: '2',
                        region: 'North America',
                        subregion: 'Northern America',
                        iso2: 'US',
                        iso3: 'USA',
                        continent: 'North America',
                        key: 'us',
                    });

                    countries.push({
                        title: 'Japan',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'JP',
                        iso3: 'JPN',
                        continent: 'Asia',
                        key: 'jp',
                    });

                    countries.push({
                        title: 'Seychelles',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'SC',
                        iso3: 'SYC',
                        continent: 'Seven seas (open ocean)',
                        key: 'sc',
                    });

                    countries.push({
                        title: 'New Zealand',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Australia and New Zealand',
                        iso2: 'NZ',
                        iso3: 'NZL',
                        continent: 'Oceania',
                        key: 'nz',
                    });

                    countries.push({
                        title: 'India',
                        rank: '2',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'IN',
                        iso3: 'IND',
                        continent: 'Asia',
                        key: 'in',
                    });

                    countries.push({
                        title: 'South Korea',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'KR',
                        iso3: 'KOR',
                        continent: 'Asia',
                        key: 'kr',
                    });

                    countries.push({
                        title: 'France',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'FR',
                        iso3: 'FRA',
                        continent: 'Europe',
                        key: 'fr',
                    });

                    countries.push({
                        title: 'Federated States of Micronesia',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'FM',
                        iso3: 'FSM',
                        continent: 'Oceania',
                        key: 'fm',
                    });

                    countries.push({
                        title: 'Cuba',
                        rank: '3',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'CU',
                        iso3: 'CUB',
                        continent: 'North America',
                        key: 'cu',
                    });

                    countries.push({
                        title: 'China',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'CN',
                        iso3: 'CHN',
                        continent: 'Asia',
                        key: 'cn',
                    });

                    countries.push({
                        title: 'Portugal',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'PT',
                        iso3: 'PRT',
                        continent: 'Europe',
                        key: 'pt',
                    });

                    countries.push({
                        title: 'Serranilla Bank',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'SW',
                        iso3: '-99',
                        continent: 'North America',
                        key: 'sw',
                    });

                    countries.push({
                        title: 'Scarborough Reef',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'SH',
                        iso3: '-99',
                        continent: 'Asia',
                        key: 'sh',
                    });

                    countries.push({
                        title: 'Brazil',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'BR',
                        iso3: 'BRA',
                        continent: 'South America',
                        key: 'br',
                    });

                    countries.push({
                        title: 'Ecuador',
                        rank: '3',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'EC',
                        iso3: 'ECU',
                        continent: 'South America',
                        key: 'ec',
                    });

                    countries.push({
                        title: 'Australia',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Australia and New Zealand',
                        iso2: 'AU',
                        iso3: 'AUS',
                        continent: 'Oceania',
                        key: 'au',
                    });

                    countries.push({
                        title: 'Kiribati',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'KI',
                        iso3: 'KIR',
                        continent: 'Oceania',
                        key: 'ki',
                    });

                    countries.push({
                        title: 'Philippines',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'PH',
                        iso3: 'PHL',
                        continent: 'Asia',
                        key: 'ph',
                    });

                    countries.push({
                        title: 'Mexico',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'MX',
                        iso3: 'MEX',
                        continent: 'North America',
                        key: 'mx',
                    });

                    countries.push({
                        title: 'Spain',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'ES',
                        iso3: 'ESP',
                        continent: 'Europe',
                        key: 'es',
                    });

                    countries.push({
                        title: 'Bajo Nuevo Bank (Petrel Is.)',
                        rank: '8',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'BU',
                        iso3: '-99',
                        continent: 'North America',
                        key: 'bu',
                    });

                    countries.push({
                        title: 'Maldives',
                        rank: '5',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'MV',
                        iso3: 'MDV',
                        continent: 'Seven seas (open ocean)',
                        key: 'mv',
                    });

                    countries.push({
                        title: 'Spratly Islands',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'SP',
                        iso3: 'SPI',
                        continent: 'Asia',
                        key: 'sp',
                    });

                    countries.push({
                        title: 'United Kingdom',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'GB',
                        iso3: 'GBR',
                        continent: 'Europe',
                        key: 'gb',
                    });

                    countries.push({
                        title: 'Greece',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'GR',
                        iso3: 'GRC',
                        continent: 'Europe',
                        key: 'gr',
                    });

                    countries.push({
                        title: 'American Samoa',
                        rank: '4',
                        region: 'East Asia & Pacific',
                        subregion: 'Polynesia',
                        iso2: 'AS',
                        iso3: 'ASM',
                        continent: 'Oceania',
                        key: 'as',
                    });

                    countries.push({
                        title: 'Denmark',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'DK',
                        iso3: 'DNK',
                        continent: 'Europe',
                        key: 'dk',
                    });

                    countries.push({
                        title: 'Greenland',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern America',
                        iso2: 'GL',
                        iso3: 'GRL',
                        continent: 'North America',
                        key: 'gl',
                    });

                    countries.push({
                        title: 'Guam',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'GU',
                        iso3: 'GUM',
                        continent: 'Oceania',
                        key: 'gu',
                    });

                    countries.push({
                        title: 'Northern Mariana Islands',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'MP',
                        iso3: 'MNP',
                        continent: 'Oceania',
                        key: 'mp',
                    });

                    countries.push({
                        title: 'Puerto Rico',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'PR',
                        iso3: 'PRI',
                        continent: 'North America',
                        key: 'pr',
                    });

                    countries.push({
                        title: 'United States Virgin Islands',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'VI',
                        iso3: 'VIR',
                        continent: 'North America',
                        key: 'vi',
                    });

                    countries.push({
                        title: 'Canada',
                        rank: '2',
                        region: 'North America',
                        subregion: 'Northern America',
                        iso2: 'CA',
                        iso3: 'CAN',
                        continent: 'North America',
                        key: 'ca',
                    });

                    countries.push({
                        title: 'Sao Tome and Principe',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'ST',
                        iso3: 'STP',
                        continent: 'Africa',
                        key: 'st',
                    });

                    countries.push({
                        title: 'United Republic of Tanzania',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'TZ',
                        iso3: 'TZA',
                        continent: 'Africa',
                        key: 'tz',
                    });

                    countries.push({
                        title: 'Argentina',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'AR',
                        iso3: 'ARG',
                        continent: 'South America',
                        key: 'ar',
                    });

                    countries.push({
                        title: 'Cape Verde',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'CV',
                        iso3: 'CPV',
                        continent: 'Africa',
                        key: 'cv',
                    });

                    countries.push({
                        title: 'Dominica',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'DM',
                        iso3: 'DMA',
                        continent: 'North America',
                        key: 'dm',
                    });

                    countries.push({
                        title: 'Netherlands',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'NL',
                        iso3: 'NLD',
                        continent: 'Europe',
                        key: 'nl',
                    });

                    countries.push({
                        title: 'Yemen',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'YE',
                        iso3: 'YEM',
                        continent: 'Asia',
                        key: 'ye',
                    });

                    countries.push({
                        title: 'Jamaica',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'JM',
                        iso3: 'JAM',
                        continent: 'North America',
                        key: 'jm',
                    });

                    countries.push({
                        title: 'Samoa',
                        rank: '4',
                        region: 'East Asia & Pacific',
                        subregion: 'Polynesia',
                        iso2: 'WS',
                        iso3: 'WSM',
                        continent: 'Oceania',
                        key: 'ws',
                    });

                    countries.push({
                        title: 'Oman',
                        rank: '4',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'OM',
                        iso3: 'OMN',
                        continent: 'Asia',
                        key: 'om',
                    });

                    countries.push({
                        title: 'Saint Vincent and the Grenadines',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'VC',
                        iso3: 'VCT',
                        continent: 'North America',
                        key: 'vc',
                    });

                    countries.push({
                        title: 'Turkey',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'TR',
                        iso3: 'TUR',
                        continent: 'Asia',
                        key: 'tr',
                    });

                    countries.push({
                        title: 'Bangladesh',
                        rank: '3',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'BD',
                        iso3: 'BGD',
                        continent: 'Asia',
                        key: 'bd',
                    });

                    countries.push({
                        title: 'Solomon Islands',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'Melanesia',
                        iso2: 'SB',
                        iso3: 'SLB',
                        continent: 'Oceania',
                        key: 'sb',
                    });

                    countries.push({
                        title: 'Saint Lucia',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'LC',
                        iso3: 'LCA',
                        continent: 'North America',
                        key: 'lc',
                    });

                    countries.push({
                        title: 'Nauru',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'NR',
                        iso3: 'NRU',
                        continent: 'Oceania',
                        key: 'nr',
                    });

                    countries.push({
                        title: 'Norway',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'NO',
                        iso3: 'NOR',
                        continent: 'Europe',
                        key: 'no',
                    });

                    countries.push({
                        title: 'Saint Kitts and Nevis',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'KN',
                        iso3: 'KNA',
                        continent: 'North America',
                        key: 'kn',
                    });

                    countries.push({
                        title: 'Bahrain',
                        rank: '4',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'BH',
                        iso3: 'BHR',
                        continent: 'Asia',
                        key: 'bh',
                    });

                    countries.push({
                        title: 'Tonga',
                        rank: '4',
                        region: 'East Asia & Pacific',
                        subregion: 'Polynesia',
                        iso2: 'TO',
                        iso3: 'TON',
                        continent: 'Oceania',
                        key: 'to',
                    });

                    countries.push({
                        title: 'Finland',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'FI',
                        iso3: 'FIN',
                        continent: 'Europe',
                        key: 'fi',
                    });

                    countries.push({
                        title: 'Indonesia',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'ID',
                        iso3: 'IDN',
                        continent: 'Asia',
                        key: 'id',
                    });

                    countries.push({
                        title: 'Mauritius',
                        rank: '5',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'MU',
                        iso3: 'MUS',
                        continent: 'Seven seas (open ocean)',
                        key: 'mu',
                    });

                    countries.push({
                        title: 'Sweden',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'SE',
                        iso3: 'SWE',
                        continent: 'Europe',
                        key: 'se',
                    });

                    countries.push({
                        title: 'Trinidad and Tobago',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'TT',
                        iso3: 'TTO',
                        continent: 'North America',
                        key: 'tt',
                    });

                    countries.push({
                        title: 'Malaysia',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'MY',
                        iso3: 'MYS',
                        continent: 'Asia',
                        key: 'my',
                    });

                    countries.push({
                        title: 'The Bahamas',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'BS',
                        iso3: 'BHS',
                        continent: 'North America',
                        key: 'bs',
                    });

                    countries.push({
                        title: 'Palau',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'PW',
                        iso3: 'PLW',
                        continent: 'Oceania',
                        key: 'pw',
                    });

                    countries.push({
                        title: 'Iran',
                        rank: '2',
                        region: 'Middle East & North Africa',
                        subregion: 'Southern Asia',
                        iso2: 'IR',
                        iso3: 'IRN',
                        continent: 'Asia',
                        key: 'ir',
                    });

                    countries.push({
                        title: 'Tuvalu',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Polynesia',
                        iso2: 'TV',
                        iso3: 'TUV',
                        continent: 'Oceania',
                        key: 'tv',
                    });

                    countries.push({
                        title: 'Marshall Islands',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Micronesia',
                        iso2: 'MH',
                        iso3: 'MHL',
                        continent: 'Oceania',
                        key: 'mh',
                    });

                    countries.push({
                        title: 'Chile',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'CL',
                        iso3: 'CHL',
                        continent: 'South America',
                        key: 'cl',
                    });

                    countries.push({
                        title: 'Thailand',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'TH',
                        iso3: 'THA',
                        continent: 'Asia',
                        key: 'th',
                    });

                    countries.push({
                        title: 'Grenada',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'GD',
                        iso3: 'GRD',
                        continent: 'North America',
                        key: 'gd',
                    });

                    countries.push({
                        title: 'Estonia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'EE',
                        iso3: 'EST',
                        continent: 'Europe',
                        key: 'ee',
                    });

                    countries.push({
                        title: 'Antigua and Barbuda',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'AG',
                        iso3: 'ATG',
                        continent: 'North America',
                        key: 'ag',
                    });

                    countries.push({
                        title: 'Taiwan',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'TW',
                        iso3: 'TWN',
                        continent: 'Asia',
                        key: 'tw',
                    });

                    countries.push({
                        title: 'Barbados',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'BB',
                        iso3: 'BRB',
                        continent: 'North America',
                        key: 'bb',
                    });

                    countries.push({
                        title: 'Italy',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'IT',
                        iso3: 'ITA',
                        continent: 'Europe',
                        key: 'it',
                    });

                    countries.push({
                        title: 'Malta',
                        rank: '5',
                        region: 'Middle East & North Africa',
                        subregion: 'Southern Europe',
                        iso2: 'MT',
                        iso3: 'MLT',
                        continent: 'Europe',
                        key: 'mt',
                    });

                    countries.push({
                        title: 'Papua New Guinea',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'Melanesia',
                        iso2: 'PG',
                        iso3: 'PNG',
                        continent: 'Oceania',
                        key: 'pg',
                    });

                    countries.push({
                        title: 'Germany',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'DE',
                        iso3: 'DEU',
                        continent: 'Europe',
                        key: 'de',
                    });

                    countries.push({
                        title: 'Vanuatu',
                        rank: '4',
                        region: 'East Asia & Pacific',
                        subregion: 'Melanesia',
                        iso2: 'VU',
                        iso3: 'VUT',
                        continent: 'Oceania',
                        key: 'vu',
                    });

                    countries.push({
                        title: 'Equatorial Guinea',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'GQ',
                        iso3: 'GNQ',
                        continent: 'Africa',
                        key: 'gq',
                    });

                    countries.push({
                        title: 'Cyprus',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'CY',
                        iso3: 'CYP',
                        continent: 'Asia',
                        key: 'cy',
                    });

                    countries.push({
                        title: 'Comoros',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'KM',
                        iso3: 'COM',
                        continent: 'Africa',
                        key: 'km',
                    });

                    countries.push({
                        title: 'Fiji',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'Melanesia',
                        iso2: 'FJ',
                        iso3: 'FJI',
                        continent: 'Oceania',
                        key: 'fj',
                    });

                    countries.push({
                        title: 'Russia',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'RU',
                        iso3: 'RUS',
                        continent: 'Europe',
                        key: 'ru',
                    });

                    countries.push({
                        title: 'Uganda',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'UG',
                        iso3: 'UGA',
                        continent: 'Africa',
                        key: 'ug',
                    });

                    countries.push({
                        title: 'Vatican',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'VA',
                        iso3: 'VAT',
                        continent: 'Europe',
                        key: 'va',
                    });

                    countries.push({
                        title: 'San Marino',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'SM',
                        iso3: 'SMR',
                        continent: 'Europe',
                        key: 'sm',
                    });

                    countries.push({
                        title: 'Kazakhstan',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Central Asia',
                        iso2: 'KZ',
                        iso3: 'KAZ',
                        continent: 'Asia',
                        key: 'kz',
                    });

                    countries.push({
                        title: 'Azerbaijan',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'AZ',
                        iso3: 'AZE',
                        continent: 'Asia',
                        key: 'az',
                    });

                    countries.push({
                        title: 'Armenia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'AM',
                        iso3: 'ARM',
                        continent: 'Asia',
                        key: 'am',
                    });

                    countries.push({
                        title: 'Tajikistan',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Central Asia',
                        iso2: 'TJ',
                        iso3: 'TJK',
                        continent: 'Asia',
                        key: 'tj',
                    });

                    countries.push({
                        title: 'Lesotho',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Southern Africa',
                        iso2: 'LS',
                        iso3: 'LSO',
                        continent: 'Africa',
                        key: 'ls',
                    });

                    countries.push({
                        title: 'Uzbekistan',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Central Asia',
                        iso2: 'UZ',
                        iso3: 'UZB',
                        continent: 'Asia',
                        key: 'uz',
                    });

                    countries.push({
                        title: 'Morocco',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'MA',
                        iso3: 'MAR',
                        continent: 'Africa',
                        key: 'ma',
                    });

                    countries.push({
                        title: 'Colombia',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'CO',
                        iso3: 'COL',
                        continent: 'South America',
                        key: 'co',
                    });

                    countries.push({
                        title: 'East Timor',
                        rank: '5',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'TL',
                        iso3: 'TLS',
                        continent: 'Asia',
                        key: 'tl',
                    });

                    countries.push({
                        title: 'Cambodia',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'KH',
                        iso3: 'KHM',
                        continent: 'Asia',
                        key: 'kh',
                    });

                    countries.push({
                        title: 'Saudi Arabia',
                        rank: '2',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'SA',
                        iso3: 'SAU',
                        continent: 'Asia',
                        key: 'sa',
                    });

                    countries.push({
                        title: 'Pakistan',
                        rank: '2',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'PK',
                        iso3: 'PAK',
                        continent: 'Asia',
                        key: 'pk',
                    });

                    countries.push({
                        title: 'United Arab Emirates',
                        rank: '4',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'AE',
                        iso3: 'ARE',
                        continent: 'Asia',
                        key: 'ae',
                    });

                    countries.push({
                        title: 'Kenya',
                        rank: '2',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'KE',
                        iso3: 'KEN',
                        continent: 'Africa',
                        key: 'ke',
                    });

                    countries.push({
                        title: 'Peru',
                        rank: '2',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'PE',
                        iso3: 'PER',
                        continent: 'South America',
                        key: 'pe',
                    });

                    countries.push({
                        title: 'Dominican Republic',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'DO',
                        iso3: 'DOM',
                        continent: 'North America',
                        key: 'do',
                    });

                    countries.push({
                        title: 'Haiti',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Caribbean',
                        iso2: 'HT',
                        iso3: 'HTI',
                        continent: 'North America',
                        key: 'ht',
                    });

                    countries.push({
                        title: 'Angola',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'AO',
                        iso3: 'AGO',
                        continent: 'Africa',
                        key: 'ao',
                    });

                    countries.push({
                        title: 'Mozambique',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'MZ',
                        iso3: 'MOZ',
                        continent: 'Africa',
                        key: 'mz',
                    });

                    countries.push({
                        title: 'Panama',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'PA',
                        iso3: 'PAN',
                        continent: 'North America',
                        key: 'pa',
                    });

                    countries.push({
                        title: 'Costa Rica',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'CR',
                        iso3: 'CRI',
                        continent: 'North America',
                        key: 'cr',
                    });

                    countries.push({
                        title: 'El Salvador',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'SV',
                        iso3: 'SLV',
                        continent: 'North America',
                        key: 'sv',
                    });

                    countries.push({
                        title: 'Bolivia',
                        rank: '3',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'BO',
                        iso3: 'BOL',
                        continent: 'South America',
                        key: 'bo',
                    });

                    countries.push({
                        title: 'Croatia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'HR',
                        iso3: 'HRV',
                        continent: 'Europe',
                        key: 'hr',
                    });

                    countries.push({
                        title: 'Belize',
                        rank: '6',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'BZ',
                        iso3: 'BLZ',
                        continent: 'North America',
                        key: 'bz',
                    });

                    countries.push({
                        title: 'South Africa',
                        rank: '2',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Southern Africa',
                        iso2: 'ZA',
                        iso3: 'ZAF',
                        continent: 'Africa',
                        key: 'za',
                    });

                    countries.push({
                        title: 'Libya',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'LY',
                        iso3: 'LBY',
                        continent: 'Africa',
                        key: 'ly',
                    });

                    countries.push({
                        title: 'Sudan',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Northern Africa',
                        iso2: 'SD',
                        iso3: 'SDN',
                        continent: 'Africa',
                        key: 'sd',
                    });

                    countries.push({
                        title: 'Democratic Republic of the Congo',
                        rank: '2',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'CD',
                        iso3: 'COD',
                        continent: 'Africa',
                        key: 'cd',
                    });

                    countries.push({
                        title: 'Kuwait',
                        rank: '6',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'KW',
                        iso3: 'KWT',
                        continent: 'Asia',
                        key: 'kw',
                    });

                    countries.push({
                        title: 'Eritrea',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'ER',
                        iso3: 'ERI',
                        continent: 'Africa',
                        key: 'er',
                    });

                    countries.push({
                        title: 'Ireland',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'IE',
                        iso3: 'IRL',
                        continent: 'Europe',
                        key: 'ie',
                    });

                    countries.push({
                        title: 'North Korea',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'KP',
                        iso3: 'PRK',
                        continent: 'Asia',
                        key: 'kp',
                    });

                    countries.push({
                        title: 'Venezuela',
                        rank: '3',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'VE',
                        iso3: 'VEN',
                        continent: 'South America',
                        key: 've',
                    });

                    countries.push({
                        title: 'Guyana',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'GY',
                        iso3: 'GUY',
                        continent: 'South America',
                        key: 'gy',
                    });

                    countries.push({
                        title: 'Honduras',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'HN',
                        iso3: 'HND',
                        continent: 'North America',
                        key: 'hn',
                    });

                    countries.push({
                        title: 'Myanmar',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'MM',
                        iso3: 'MMR',
                        continent: 'Asia',
                        key: 'mm',
                    });

                    countries.push({
                        title: 'Gabon',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'GA',
                        iso3: 'GAB',
                        continent: 'Africa',
                        key: 'ga',
                    });

                    countries.push({
                        title: 'Nicaragua',
                        rank: '5',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'NI',
                        iso3: 'NIC',
                        continent: 'North America',
                        key: 'ni',
                    });

                    countries.push({
                        title: 'Malawi',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'MW',
                        iso3: 'MWI',
                        continent: 'Africa',
                        key: 'mw',
                    });

                    countries.push({
                        title: 'Somaliland',
                        rank: '5',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'SX',
                        iso3: '-99',
                        continent: 'Africa',
                        key: 'sx',
                    });

                    countries.push({
                        title: 'Turkmenistan',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Central Asia',
                        iso2: 'TM',
                        iso3: 'TKM',
                        continent: 'Asia',
                        key: 'tm',
                    });

                    countries.push({
                        title: 'Zambia',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'ZM',
                        iso3: 'ZMB',
                        continent: 'Africa',
                        key: 'zm',
                    });

                    countries.push({
                        title: 'Northern Cyprus',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'NC',
                        iso3: '-99',
                        continent: 'Asia',
                        key: 'nc',
                    });

                    countries.push({
                        title: 'Mauritania',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'MR',
                        iso3: 'MRT',
                        continent: 'Africa',
                        key: 'mr',
                    });

                    countries.push({
                        title: 'Algeria',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'DZ',
                        iso3: 'DZA',
                        continent: 'Africa',
                        key: 'dz',
                    });

                    countries.push({
                        title: 'Lithuania',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'LT',
                        iso3: 'LTU',
                        continent: 'Europe',
                        key: 'lt',
                    });

                    countries.push({
                        title: 'Ethiopia',
                        rank: '2',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'ET',
                        iso3: 'ETH',
                        continent: 'Africa',
                        key: 'et',
                    });

                    countries.push({
                        title: 'Somalia',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'SO',
                        iso3: 'SOM',
                        continent: 'Africa',
                        key: 'so',
                    });

                    countries.push({
                        title: 'Ghana',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'GH',
                        iso3: 'GHA',
                        continent: 'Africa',
                        key: 'gh',
                    });

                    countries.push({
                        title: 'Slovenia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'SI',
                        iso3: 'SVN',
                        continent: 'Europe',
                        key: 'si',
                    });

                    countries.push({
                        title: 'Guatemala',
                        rank: '3',
                        region: 'Latin America & Caribbean',
                        subregion: 'Central America',
                        iso2: 'GT',
                        iso3: 'GTM',
                        continent: 'North America',
                        key: 'gt',
                    });

                    countries.push({
                        title: 'Bosnia and Herzegovina',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'BA',
                        iso3: 'BIH',
                        continent: 'Europe',
                        key: 'ba',
                    });

                    countries.push({
                        title: 'Jordan',
                        rank: '4',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'JO',
                        iso3: 'JOR',
                        continent: 'Asia',
                        key: 'jo',
                    });

                    countries.push({
                        title: 'Monaco',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'MC',
                        iso3: 'MCO',
                        continent: 'Europe',
                        key: 'mc',
                    });

                    countries.push({
                        title: 'Albania',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'AL',
                        iso3: 'ALB',
                        continent: 'Europe',
                        key: 'al',
                    });

                    countries.push({
                        title: 'Uruguay',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'UY',
                        iso3: 'URY',
                        continent: 'South America',
                        key: 'uy',
                    });

                    countries.push({
                        title: 'Cyprus No Mans Area',
                        rank: '9',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'NULL',
                        iso3: '-99',
                        continent: 'Asia',
                        key: 'cnm',
                    });

                    countries.push({
                        title: 'Mongolia',
                        rank: '3',
                        region: 'East Asia & Pacific',
                        subregion: 'Eastern Asia',
                        iso2: 'MN',
                        iso3: 'MNG',
                        continent: 'Asia',
                        key: 'mn',
                    });

                    countries.push({
                        title: 'Rwanda',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'RW',
                        iso3: 'RWA',
                        continent: 'Africa',
                        key: 'rw',
                    });

                    countries.push({
                        title: 'Cameroon',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'CM',
                        iso3: 'CMR',
                        continent: 'Africa',
                        key: 'cm',
                    });

                    countries.push({
                        title: 'Republic of Congo',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'CG',
                        iso3: 'COG',
                        continent: 'Africa',
                        key: 'cg',
                    });

                    countries.push({
                        title: 'Western Sahara',
                        rank: '7',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'EH',
                        iso3: 'ESH',
                        continent: 'Africa',
                        key: 'eh',
                    });

                    countries.push({
                        title: 'Republic of Serbia',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'RS',
                        iso3: 'SRB',
                        continent: 'Europe',
                        key: 'rs',
                    });

                    countries.push({
                        title: 'Montenegro',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'ME',
                        iso3: 'MNE',
                        continent: 'Europe',
                        key: 'me',
                    });

                    countries.push({
                        title: 'Benin',
                        rank: '5',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'BJ',
                        iso3: 'BEN',
                        continent: 'Africa',
                        key: 'bj',
                    });

                    countries.push({
                        title: 'Nigeria',
                        rank: '2',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'NG',
                        iso3: 'NGA',
                        continent: 'Africa',
                        key: 'ng',
                    });

                    countries.push({
                        title: 'Togo',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'TG',
                        iso3: 'TGO',
                        continent: 'Africa',
                        key: 'tg',
                    });

                    countries.push({
                        title: 'Afghanistan',
                        rank: '3',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'AF',
                        iso3: 'AFG',
                        continent: 'Asia',
                        key: 'af',
                    });

                    countries.push({
                        title: 'Ukraine',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'UA',
                        iso3: 'UKR',
                        continent: 'Europe',
                        key: 'ua',
                    });

                    countries.push({
                        title: 'Slovakia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'SK',
                        iso3: 'SVK',
                        continent: 'Europe',
                        key: 'sk',
                    });

                    countries.push({
                        title: 'Siachen Glacier',
                        rank: '5',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'JK',
                        iso3: '-99',
                        continent: 'Asia',
                        key: 'jk',
                    });

                    countries.push({
                        title: 'Bulgaria',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'BG',
                        iso3: 'BGR',
                        continent: 'Europe',
                        key: 'bg',
                    });

                    countries.push({
                        title: 'Qatar',
                        rank: '5',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'QA',
                        iso3: 'QAT',
                        continent: 'Asia',
                        key: 'qa',
                    });

                    countries.push({
                        title: 'Liechtenstein',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'LI',
                        iso3: 'LIE',
                        continent: 'Europe',
                        key: 'li',
                    });

                    countries.push({
                        title: 'Austria',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'AT',
                        iso3: 'AUT',
                        continent: 'Europe',
                        key: 'at',
                    });

                    countries.push({
                        title: 'Swaziland',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Southern Africa',
                        iso2: 'SZ',
                        iso3: 'SWZ',
                        continent: 'Africa',
                        key: 'sz',
                    });

                    countries.push({
                        title: 'Hungary',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'HU',
                        iso3: 'HUN',
                        continent: 'Europe',
                        key: 'hu',
                    });

                    countries.push({
                        title: 'Romania',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'RO',
                        iso3: 'ROU',
                        continent: 'Europe',
                        key: 'ro',
                    });

                    countries.push({
                        title: 'Luxembourg',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'LU',
                        iso3: 'LUX',
                        continent: 'Europe',
                        key: 'lu',
                    });

                    countries.push({
                        title: 'Andorra',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'AD',
                        iso3: 'AND',
                        continent: 'Europe',
                        key: 'ad',
                    });

                    countries.push({
                        title: 'Ivory Coast',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'CI',
                        iso3: 'CIV',
                        continent: 'Africa',
                        key: 'ci',
                    });

                    countries.push({
                        title: 'Liberia',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'LR',
                        iso3: 'LBR',
                        continent: 'Africa',
                        key: 'lr',
                    });

                    countries.push({
                        title: 'Brunei',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'BN',
                        iso3: 'BRN',
                        continent: 'Asia',
                        key: 'bn',
                    });

                    countries.push({
                        title: 'Belgium',
                        rank: '2',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'BE',
                        iso3: 'BEL',
                        continent: 'Europe',
                        key: 'be',
                    });

                    countries.push({
                        title: 'Iraq',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'IQ',
                        iso3: 'IRQ',
                        continent: 'Asia',
                        key: 'iq',
                    });

                    countries.push({
                        title: 'Georgia',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Asia',
                        iso2: 'GE',
                        iso3: 'GEO',
                        continent: 'Asia',
                        key: 'ge',
                    });

                    countries.push({
                        title: 'Gambia',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'GM',
                        iso3: 'GMB',
                        continent: 'Africa',
                        key: 'gm',
                    });

                    countries.push({
                        title: 'Switzerland',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Western Europe',
                        iso2: 'CH',
                        iso3: 'CHE',
                        continent: 'Europe',
                        key: 'ch',
                    });

                    countries.push({
                        title: 'Chad',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'TD',
                        iso3: 'TCD',
                        continent: 'Africa',
                        key: 'td',
                    });

                    countries.push({
                        title: 'Kosovo',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'KV',
                        iso3: '-99',
                        continent: 'Europe',
                        key: 'kv',
                    });

                    countries.push({
                        title: 'Lebanon',
                        rank: '5',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'LB',
                        iso3: 'LBN',
                        continent: 'Asia',
                        key: 'lb',
                    });

                    countries.push({
                        title: 'Djibouti',
                        rank: '5',
                        region: 'Middle East & North Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'DJ',
                        iso3: 'DJI',
                        continent: 'Africa',
                        key: 'dj',
                    });

                    countries.push({
                        title: 'Burundi',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'BI',
                        iso3: 'BDI',
                        continent: 'Africa',
                        key: 'bi',
                    });

                    countries.push({
                        title: 'Suriname',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'SR',
                        iso3: 'SUR',
                        continent: 'South America',
                        key: 'sr',
                    });

                    countries.push({
                        title: 'Israel',
                        rank: '4',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'IL',
                        iso3: 'ISR',
                        continent: 'Asia',
                        key: 'il',
                    });

                    countries.push({
                        title: 'Mali',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'ML',
                        iso3: 'MLI',
                        continent: 'Africa',
                        key: 'ml',
                    });

                    countries.push({
                        title: 'Senegal',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'SN',
                        iso3: 'SEN',
                        continent: 'Africa',
                        key: 'sn',
                    });

                    countries.push({
                        title: 'Guinea Bissau',
                        rank: '6',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'GW',
                        iso3: 'GNB',
                        continent: 'Africa',
                        key: 'gw',
                    });

                    countries.push({
                        title: 'Guinea',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'GN',
                        iso3: 'GIN',
                        continent: 'Africa',
                        key: 'gn',
                    });

                    countries.push({
                        title: 'Zimbabwe',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'ZW',
                        iso3: 'ZWE',
                        continent: 'Africa',
                        key: 'zw',
                    });

                    countries.push({
                        title: 'Poland',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'PL',
                        iso3: 'POL',
                        continent: 'Europe',
                        key: 'pl',
                    });

                    countries.push({
                        title: 'Macedonia',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Southern Europe',
                        iso2: 'MK',
                        iso3: 'MKD',
                        continent: 'Europe',
                        key: 'mk',
                    });

                    countries.push({
                        title: 'Paraguay',
                        rank: '4',
                        region: 'Latin America & Caribbean',
                        subregion: 'South America',
                        iso2: 'PY',
                        iso3: 'PRY',
                        continent: 'South America',
                        key: 'py',
                    });

                    countries.push({
                        title: 'Belarus',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'BY',
                        iso3: 'BLR',
                        continent: 'Europe',
                        key: 'by',
                    });

                    countries.push({
                        title: 'Latvia',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'LV',
                        iso3: 'LVA',
                        continent: 'Europe',
                        key: 'lv',
                    });

                    countries.push({
                        title: 'Syria',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Western Asia',
                        iso2: 'SY',
                        iso3: 'SYR',
                        continent: 'Asia',
                        key: 'sy',
                    });

                    countries.push({
                        title: 'Burkina Faso',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'BF',
                        iso3: 'BFA',
                        continent: 'Africa',
                        key: 'bf',
                    });

                    countries.push({
                        title: 'Niger',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'NE',
                        iso3: 'NER',
                        continent: 'Africa',
                        key: 'ne',
                    });

                    countries.push({
                        title: 'Namibia',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Southern Africa',
                        iso2: 'NA',
                        iso3: 'NAM',
                        continent: 'Africa',
                        key: 'na',
                    });

                    countries.push({
                        title: 'Tunisia',
                        rank: '3',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'TN',
                        iso3: 'TUN',
                        continent: 'Africa',
                        key: 'tn',
                    });

                    countries.push({
                        title: 'Kyrgyzstan',
                        rank: '4',
                        region: 'Europe & Central Asia',
                        subregion: 'Central Asia',
                        iso2: 'KG',
                        iso3: 'KGZ',
                        continent: 'Asia',
                        key: 'kg',
                    });

                    countries.push({
                        title: 'Moldova',
                        rank: '6',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'MD',
                        iso3: 'MDA',
                        continent: 'Europe',
                        key: 'md',
                    });

                    countries.push({
                        title: 'South Sudan',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'SS',
                        iso3: 'SSD',
                        continent: 'Africa',
                        key: 'ss',
                    });

                    countries.push({
                        title: 'Central African Republic',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Middle Africa',
                        iso2: 'CF',
                        iso3: 'CAF',
                        continent: 'Africa',
                        key: 'cf',
                    });

                    countries.push({
                        title: 'Botswana',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Southern Africa',
                        iso2: 'BW',
                        iso3: 'BWA',
                        continent: 'Africa',
                        key: 'bw',
                    });

                    countries.push({
                        title: 'Singapore',
                        rank: '6',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'SG',
                        iso3: 'SGP',
                        continent: 'Asia',
                        key: 'sg',
                    });

                    countries.push({
                        title: 'Vietnam',
                        rank: '2',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'VN',
                        iso3: 'VNM',
                        continent: 'Asia',
                        key: 'vn',
                    });

                    countries.push({
                        title: 'Sierra Leone',
                        rank: '4',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Western Africa',
                        iso2: 'SL',
                        iso3: 'SLE',
                        continent: 'Africa',
                        key: 'sl',
                    });

                    countries.push({
                        title: 'Madagascar',
                        rank: '3',
                        region: 'Sub-Saharan Africa',
                        subregion: 'Eastern Africa',
                        iso2: 'MG',
                        iso3: 'MDG',
                        continent: 'Africa',
                        key: 'mg',
                    });

                    countries.push({
                        title: 'Iceland',
                        rank: '3',
                        region: 'Europe & Central Asia',
                        subregion: 'Northern Europe',
                        iso2: 'IS',
                        iso3: 'ISL',
                        continent: 'Europe',
                        key: 'is',
                    });

                    countries.push({
                        title: 'Egypt',
                        rank: '2',
                        region: 'Middle East & North Africa',
                        subregion: 'Northern Africa',
                        iso2: 'EG',
                        iso3: 'EGY',
                        continent: 'Africa',
                        key: 'eg',
                    });

                    countries.push({
                        title: 'Sri Lanka',
                        rank: '3',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'LK',
                        iso3: 'LKA',
                        continent: 'Asia',
                        key: 'lk',
                    });

                    countries.push({
                        title: 'Nepal',
                        rank: '3',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'NP',
                        iso3: 'NPL',
                        continent: 'Asia',
                        key: 'np',
                    });

                    countries.push({
                        title: 'Laos',
                        rank: '4',
                        region: 'East Asia & Pacific',
                        subregion: 'South-Eastern Asia',
                        iso2: 'LA',
                        iso3: 'LAO',
                        continent: 'Asia',
                        key: 'la',
                    });

                    countries.push({
                        title: 'Czech Republic',
                        rank: '5',
                        region: 'Europe & Central Asia',
                        subregion: 'Eastern Europe',
                        iso2: 'CZ',
                        iso3: 'CZE',
                        continent: 'Europe',
                        key: 'cz',
                    });

                    countries.push({
                        title: 'Bhutan',
                        rank: '5',
                        region: 'South Asia',
                        subregion: 'Southern Asia',
                        iso2: 'BT',
                        iso3: 'BTN',
                        continent: 'Asia',
                        key: 'bt',
                    });

                    return countries;
                }

            }

        ]);
}());