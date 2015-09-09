/**
 * Created by haytham.aldokanji on 9/9/15.
 */
app.controller("notepadContr1", function ($scope) {
    $scope.text = "";
    $scope.remaining = function() {
        return 60 * 30 - $scope.text.length;
    };
    $scope.clear = function() {
        $scope.text = "";
    };
    $scope.save = function() {
        alert("saved");
    }
});