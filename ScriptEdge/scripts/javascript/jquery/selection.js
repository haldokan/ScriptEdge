/**
 * Created by haytham.aldokanji on 9/10/15.
 */
$(document).ready(function () {
    $("button").click(function () {
        $("#p1").hide();
    });
    $("#mirage").click(function () {
        $(".p2").hide()
    });
    $(".middle").click(function () {
        $(this).hide()
    });
});