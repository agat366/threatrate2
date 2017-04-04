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
                    controller: 'v3'
                });

                var titles = [
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
                    ],
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
                    ],
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

                function countriesByKidnapDuration(params) {
                    return countriesByKidnap(params);
                }

                function countriesByVehicleAttack(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesByChildKidnap(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesByForeignersKidnapDuration(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
                }

                function countriesByForeignersKidnap(params) {
                    // todo: countries by custom filters
                    return countriesByKidnap(params);
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

                function countriesByKidnap(params) {
                    params = params || {};

                    var def = $q.defer();

                    context.get('countriesByKidnap', params)
                        .then(function (result) {
                            def.resolve(result);
                        }).catch(function () {
                            var top = params.top || 200;
                            var result = renderList(top, function (n) {
                                var rnd = Math.random();
                                var id = Math.round(Math.random() * 190);
                                var title = _.find(titles, function (c) { return c[0] === id; });
                                if (title) {
                                    title = title[1];
                                } else {
                                    title = '-';
                                }
                                return {
                                    value: Math.round(rnd * 200),
                                    name: id,
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


                this.countriesByKidnap = countriesByKidnap;
                this.countriesByKidnapDuration = countriesByKidnapDuration;
                this.countriesByVehicleAttack = countriesByVehicleAttack;
                this.countriesByChildKidnap = countriesByChildKidnap;
                this.countriesByForeignersKidnapDuration = countriesByForeignersKidnapDuration;
                this.countriesByForeignersKidnap = countriesByForeignersKidnap;
                this.countriesByUnrest = countriesByUnrest;
                this.countriesBySuicideAttack = countriesBySuicideAttack;
                this.countriesByKidnapKilled = countriesByKidnapKilled;
            }
        ]);
}());