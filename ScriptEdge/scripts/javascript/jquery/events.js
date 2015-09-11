/**
 * Created by haytham.aldokanji on 9/11/15.
 */
$(document).ready(function () {
    $("#p1").click(function () {
        $(this).hide()
    });
    $("#p2").dblclick(function () {
        $(this).hide()
    });
    //fires every time mouse cursor is over btn b1 (no clicking is needed)
    $("#b1").mouseenter(function () {
        console.log("b1 mouseenter");
    });
    $("#b1").mouseleave(function () {
        console.log("b1 mouseleave");
    });
    $("#b1").mousedown(function () {
        console.log("b1 mousedown");
    });
    $("#b1").mouseup(function () {
        console.log("b1 mouseup");
    });
    //hover is a combination of mouseenter and mouseleave
    $("#b2").hover(function () {
        console.log("hovering over btn b2");
    }, function () {
        console.log("hovering ends over btn b2");
    });
    //focus fires and event when a form field gets focus
    $("input").focus(function () {
        $(this).css("background-color", "#cccccc")
    });
    //focus fires and event when a form field loses focus
    $("input").blur(function () {
        $(this).css("background-color", "#ffffff")
    });
    // 'on' attaches multiple events to an html element
    $("p").on({
        mouseenter: function () {
            $(this).css("background-color", "lightgray");
        }, mouseleave: function () {
            $(this).css("background-color", "lightblue");
        }, click: function() {
            $(this).css("background-color", "yellow");
        }
    });
});