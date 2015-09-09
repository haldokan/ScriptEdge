/**
 * Created by haytham.aldokanji on 9/9/15.
 */
app.controller("notepadContr2", function ($scope) {
    $scope.input = "";
    $scope.toupper = function() {
        return angular.uppercase($scope.input);
    }
});