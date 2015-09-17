/**
 * Created by haytham.aldokanji on 9/17/15.
 */
$(document).ready(function () {
    $('#btn1').on('click', function () {
        $('p').append('clicked...');

        $('div').each(function (ndx) {
            $(this).fadeIn().fadeOut(1000 * (ndx + 1))
        });
        $('div').promise().done(function () {
            $('p').append('Done!');
        });
    });
});
