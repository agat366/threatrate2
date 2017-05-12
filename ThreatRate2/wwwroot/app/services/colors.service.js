(function () {
    'use strict';
    var serviceId = 'colorsService';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q',
            function ($q) {

                var c = {
                    fixed6: 'fixed6',
                    fixed6v2: 'fixed6v2',
                    fixed5: 'fixed5',
                    fixed4: 'fixed4',
//                    fixed3: 'fixed3',


                    levels10: 'levels10',
                    levels6: 'levels6',
                    levels4: 'levels4',
                    levels3: 'levels3',

                    male: 'male',
                    female: 'female',

                    veryHigh: 'veryHigh',
                    high: 'high',
                    mediumHigh: 'mediumHigh',
                    medium: 'medium',
                    low: 'low',
                    veryLow: 'veryLow',

                    empty: 'empty',

                    additionalHigh: 'additionalHigh',
                    additionalMedium: 'additionalMedium',
                    additionalLow: 'additionalLow'
                };

                var basics = [
                    c.veryHigh,
                    c.high,
                    c.mediumHigh,
                    c.medium,
                    c.low,
                    c.veryLow,

                    c.male,
                    c.female,

                    c.empty,

                    c.additionalHigh,
                    c.additionalMedium,
                    c.additionalLow
                ];

                var schemas = {};
                schemas[c.veryHigh] = '#b02819';
                schemas[c.high] = '#f13e2b';
                schemas[c.mediumHigh] = '#dc6355';
                schemas[c.medium] = '#959595';
                schemas[c.low] = '#387390';
                schemas[c.veryLow] = '#bbd6e4';

                schemas[c.additionalHigh] = '#febdb4';
                schemas[c.additionalMedium] = '#d5d6d9';
                schemas[c.additionalLow] = '#2a7983';

//                schemas[c.empty] = 'rgba(255,255,255, 0)';
                schemas[c.empty] = '#fff';

                schemas[c.male] = schemas[c.veryLow];
                schemas[c.female] = schemas[c.veryHigh];

                schemas[c.fixed6] = [
                    schemas[c.veryLow],
                    schemas[c.low],
                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.fixed6v2] = [
                    schemas[c.veryLow],
                    schemas[c.additionalLow],
                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.fixed5] = [
                    schemas[c.veryLow],
//                    schemas[c.low],
                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.fixed4] = [
                    schemas[c.veryLow],
//                    schemas[c.low],
                    schemas[c.medium],
//                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];

                schemas[c.levels10] = [
                    schemas[c.veryLow],
                    schemas[c.additionalLow],
                    schemas[c.low],
                    schemas[c.additionalMedium],
                    schemas[c.medium],
                    schemas[c.additionalHigh],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.levels6] = [
                    schemas[c.veryLow],
                    schemas[c.low],
                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.levels4] = [
                    schemas[c.additionalHigh],
//                    schemas[c.low],
//                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];
                schemas[c.levels3] = [
//                    schemas[c.veryLow],
//                    schemas[c.low],
//                    schemas[c.medium],
                    schemas[c.mediumHigh],
                    schemas[c.high],
                    schemas[c.veryHigh]
                ];


                function getColor(schemaName, percentageOrValue, maxValue) {
                    var schema = schemas[schemaName];
                    var color = null;
                    if (schema) {
                        if (_.includes(basics, schemaName)) {
                            color = schema;
                        } else {
                            var percentage;
                            if (maxValue === undefined) {
                                percentage = percentageOrValue;
                            } else {
                                percentage = percentageOrValue / maxValue;
                            }
                            if (percentage < 0) {
                                percentage = 0;
                            } else if (percentage > 1) {
                                percentage = 1;
                            }
                            if (percentage === 1) {
                                percentage /= 1.0000001;
                            }
                            color = schema[Math.round(schema.length * percentage - .5)];
                        }
                    }

                    return color;
                }

                function getSchema(schemaName) {
                    return angular.copy(schemas[schemaName]);
                }


                return {
                    schemas: angular.copy(c),
                    getSchema: getSchema,
                    getColor: getColor


                }


            }
        ]);
}());