
function mult(x, y) {
    return x * y;
}

console.log("mult1=> " + mult(777, 333));

// functions don't check for the number of params passed in the call
// params not passed are replaced with undefined
console.log("mult-NaN=> " + mult());
// can pass more params than required and the extra params are ignored
console.log("mult1-extra params=> " + mult(2, 3, 7));

//functions have access to a built-in array called 'arguments' that holds the args passed to the func
// we can write an average func that accepts any number of args this way (we will see later better ways to do that):
function average() {
    var sum = 0;
    for (var i = 0, l = arguments.length; i < l; i++) {
        sum += arguments[i];
    }
    return sum / arguments.length;
}
// note that we have to pass a comma-separated list of args
console.log("avg1=> " + average(2, 3, 4, 5, 6, 7));

//the same thing can be accomplished by have average take an array and iterating on the array instead of 'arguments'
function average2(arr) {
    var sum = 0;
    for (var i = 0, l = arr.length; i < l; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}
// note that we now have to call average2 with and array
console.log("avg2=> " + average2([2, 3, 4, 5, 6, 7]));

// what if we wanted to call the no-args function 'average' passing an array? for that we use 'apply'. More on that later.
// Not that we are actually calling a method 'apply' on the function. This underscores that funcs are objects too (similar to Python)
console.log("avg3=> " + average.apply(null, [1, 2, 3]));

// we can create anonymous funcs
// here assigned to a va

var sum = function (a, b) {
    return a + b;
};
console.log("sum1=> " + sum(3, 7));
// here using anonymous funcs to effectively do block scoping of vars (not supported in javascript):
var a = 1;
var b = 2;

(function scopeWork() {
    //b is scoped to the func
    var b = 33;
    a += b;
})();
// a is incr by the scoped b
console.log("a=> " + a);
// b is the one defined outside the func
console.log("b=> " + b);

// funcs can be called recursively which helps in the DOM browser to read tree structures
// This func is lifted from the introduction on Mozilla website. Not sure of the intent of this func but it will not
// compute the total length of text elements in the DOM since 'count' is reset when calls are unstacked.
function countChars(dom) {
    if (dom.nodeType == 3) {
        console.log(">>" + dom.nodeValue + "<<");
        return dom.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = dom.childNodes[i]; i++) {
        count += countChars(child);
        console.log("count1:" + count);
    }
    return count;
}
//put sth in document so it has a body
document.write("foobar");
console.log(countChars(document.body));

// anonymous funcs can also be called recursively; here countDomChars is assigned to the result of recursive func call
var countDomChars = (function countChars(dom) {
    if (dom.nodeType === 3) {
        console.log("##" + dom.nodeValue + "##");
        return dom.nodeValue.length;
    }
    var count = 0;
    for (var i = 0, child; child = dom.childNodes[i]; i++) {
        count += countChars(child);
        console.log("count2:" + count);
    }
    return count;
})(document.body);

console.log("countDomChars=> " + countDomChars);

