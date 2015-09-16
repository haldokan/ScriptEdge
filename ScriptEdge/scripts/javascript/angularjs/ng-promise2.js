/**
 * Created by haytham.aldokanji on 9/15/15.
 */

var app = angular.module('promise', []);
app.controller('promiseContr', function ($scope, $q) {
    // A-> $http function is implemented in order to follow the standard Adapter pattern
    $scope.http = function (url) {

        // A small example of object
        var core = {

            // Method that performs the ajax request
            ajax: function (method, url, args) {

                // Creating a promise
                var promise = $q(function (resolve, reject) {

                    // Instantiates the XMLHttpRequest
                    var client = new XMLHttpRequest();
                    var uri = url;

                    if (args && (method === 'POST' || method === 'PUT')) {
                        uri += '?';
                        var argcount = 0;
                        for (var key in args) {
                            if (args.hasOwnProperty(key)) {
                                if (argcount++) {
                                    uri += '&';
                                }
                                uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                            }
                        }
                    }

                    client.open(method, uri);
                    client.send();

                    client.onload = function () {
                        if (this.status == 200) {
                            // Performs the function "resolve" when this.status is equal to 200
                            console.log("resolving...");
                            resolve(this.response);
                        } else {
                            // Performs the function "reject" when this.status is different than 200
                            reject(this.statusText);
                        }
                    };
                    client.onerror = function () {
                        reject(this.statusText);
                    };
                });

                // Return the promise
                return promise;
            }
        };

        // Adapter pattern
        return {
            'get': function (args) {
                return core.ajax('GET', url, args);
            },
            'post': function (args) {
                return core.ajax('POST', url, args);
            },
            'put': function (args) {
                return core.ajax('PUT', url, args);
            },
            'delete': function (args) {
                return core.ajax('DELETE', url, args);
            }
        };
    }

// End A

// B-> Here you define its functions and its $scope.payload
    var mdnAPI = 'https://developer.mozilla.org/en-US/search.json';
    $scope.payload = {
        'topic': 'js',
        'q': 'Promise'
    };

    $scope.callback = {
        success: function (data) {
            console.log(1, 'success', JSON.parse(data));
        },
        error: function (data) {
            console.log(2, 'error', JSON.parse(data));
        },
        notify: function (data) {
            console.log(3, 'notify', 'record received');
        },
        cleanup: function (data) {
            console.log(4, 'cleaning up resources');
        }
    };
// End B

// Executes the method call
    $scope.xhr = function () {
        console.log("b4 call to $http");
        $scope.http(mdnAPI)
            .get($scope.payload)
            // notifycallback *may* be called 0 or more times to provide progress info b4 the promise is resolved or rejected.
            // We also have promise.catch(errorcallback) which is a shortcut for then(undefined, errorcallback).
            //promise.finally(callback, notifycallback) that is good for closing resources or cleaning up at the success
            // or failure of the promise
            .then($scope.callback.success, $scope.callback.error, $scope.callback.notify).finally($scope.callback.cleanup);
        console.log("after call to $http");
    };
});
