/**
 * Created by haytham.aldokanji on 9/11/15.
 */
$(document).ready(function () {
    $("#b1").click(function () {
        //load(url, data, callback) method loads data from a server and puts it into the selected html element. It does not cache in the browser
        // data (optional): query string key/value to send along with the request
        // callback (optional) name of a func to execute after load mthd is completed
        $("#p1").load("ajax.txt");
    });
    $("#b2").click(function () {
        // It is possible to specify url selectors. Here we load only paragraph #p1 from ajax.txt to div1
        // the callback func can have diff params: response, status of load request (success, failure), and the xml http
        // request obj
        $("#div1").load("ajax.txt #p1", function (response, status, xhr) {
            if (status === "success") {
                alert("Load succeeded!");
            } else if (status === 'error') {
                alert("Load failed: " + xhr.status + ": " + xhr.statusText);
            }
        });
    });
    $("#b3").click(function () {
        //$.get(url, callback) method request data from a server using GET method (returned data may be cached in the browser)
        $.get("ajax.txt", function (data, status) {
            console.log(status + "\n" + data);
        });
    });
    $("#b4").click(function () {
        //$.post(url, data, callback) post data to the server. Returned data (if any) is never cached in browser)
        $.post("ajax1.asp", {travelMthd: "Flight", travelDest: "France"}, function (data, status) {
            // the asp page is not rendered for some reason (even when I replace that with alert popup)
            console.log(status + "\n" + data);
        });
    });
});

