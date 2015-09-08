/**
 * Created by haytham.aldokanji on 9/8/15.
 */
var app = angular.module('intro', []);
app.controller('introContr', function($scope){
    $scope.brand = "Ford";
    $scope.type = "Truck";
    $scope.countries = [{country:'USA', pop:450000000}, {country:'Canada', pop:35000000},
        {country:'Germany', pop:85000000}, {country:'France',pop:60000000}, {country:'UK',pop:65000000}];
    // sort the countries by their pops
    $scope.sorter = function() {
        return $scope.countries.sort(function(c1, c2){
            // this will return negative, 0, or positive numbers fulfilling the return types of the comparater
            return c1.pop - c2.pop;
        });
    };
});
