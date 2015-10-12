/**
 * Created by haytham.aldokanji on 9/17/15.
 */
$(document).ready(function () {
    //var dfd = jQuery.Deferred();

    function asyncFunc1() {
        var dfd = jQuery.Deferred();
        // setTimeout does not 'wait' the thread (unlike java.sleep)
        setTimeout(function () {
            dfd.resolve("Success<br>");
        }, 400 + Math.random() * 2000);
        setTimeout(function () {
            dfd.reject("Reject<br>");
        }, 400 + Math.random() * 2000);
        setTimeout(function working() {
            if (dfd.state() === "pending") {
                dfd.notify("working...<br>");
                //this is actually a recursive call to the 'working' func with 500 delay
                setTimeout(working, 500);
            }
        }, 1);

        return dfd.promise();
    }

    var stateKeeper = {
        state: "init",
        updateState: function(newState) {
            state = newState;
            $("#p2").append(state).append("<br>");
        }
    };

    // promote an existing obj to a promise
    function asyncFunc2() {
        var dfd = $.Deferred();
        dfd.promise(stateKeeper);

        setTimeout(function () {
            dfd.resolve("running");
        }, 3000);
        // callback when deferred is resolved. We also have deferred.fail() (rejection), deferred.always (resolved or
        // rejected), deferred.notify(progress)
        stateKeeper.done(function (state) {
            stateKeeper.updateState(state);
        }).updateState("starting");
    }

    $("#btn1").click(function () {
        $.when(asyncFunc1()).then(function (input) {
            output(input);
        }, function (input) {
            output(input);
        }, function (input) {
            output(input);
        });
        output("Synh call done!<br>");
    });

    $("#btn2").click(function () {
        asyncFunc2();
    });

    function output(data) {
        $("#p1").append(data);
    }
});