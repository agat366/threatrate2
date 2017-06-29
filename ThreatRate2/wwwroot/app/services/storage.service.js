(function () {
    'use strict';
    var serviceId = 'storageService';
    angular
        .module('tr')
        .service(serviceId,
        [
            '$q',
            function ($q) {

                var isLocalStorageAvailable = (function() {
                    var uid = new Date;
                    var result = false;
                    try {
                        localStorage.setItem(uid, uid);
                        result = localStorage.getItem(uid) == uid;
                        localStorage.removeItem(uid);
                        result = !!result && !!localStorage;
                    } catch (exception) {
                    }
                    return result;
                }());

                function getValue(key) {
                    if (isLocalStorageAvailable) {
                        var value = localStorage.getItem(key);
                        if (value) {
                            try {
                                return angular.fromJson(value);
                            } catch (er){}
                        }
                    }
                }

                function setValue(key, value, property) {
                    if (isLocalStorageAvailable) {
                        var prevStorage = {};
                        if (property) {
                            prevStorage = getValue(key) || {};
                            prevStorage[property] = value;
                        } else {
                            prevStorage = value;
                        }
                        localStorage.setItem(key, angular.toJson(prevStorage));
                    }
                }

                return {
                    getValue: getValue,
                    setValue: setValue


                }


            }
        ]);
}());