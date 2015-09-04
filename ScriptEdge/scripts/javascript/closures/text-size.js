/**
 * Created by haytham.aldokanji on 9/4/15.
 */

function textSizer(size) {
    return function () {
        document.body.style.fontSize = size + 'px';
    };
}

window.onload = function() {
    var size12 = textSizer(12);
    var size14 = textSizer(14);
    var size16 = textSizer(16);

    document.getElementById('size-12').onclick = size12;
    document.getElementById('size-14').onclick = size14;
    document.getElementById('size-16').onclick = size16;
};