/**
 * Created by haytham.aldokanji on 9/1/15.
 */

//=============================================
// Types
//=============================================
// Number, String, Boolean, Symbol(edition 6), Object(Function, Array, Date, RegExp), null, undefined

//=============================================
// Numbers
//=============================================
console.log(Math.PI);
// must always specify the base to avoid surprises
console.log(parseInt("00123", 10));
console.log(parseInt("00777", 10));
// convert binary: 1001 is 9
console.log(parseInt("1001", 2));
console.log(123 + 2);
//special value NaN
console.log(isNaN(parseInt("foobar"), 10));
// Infinity
console.log(isFinite(1 / 0));
console.log(isFinite(-Infinity));
// parseInt and parseFloat reads the string until the first unvalid char and convert the valid part!
console.log(parseInt("0123foobar"));

//=============================================
// Strings
//=============================================
console.log("foobar".length);
console.log("foobar".charAt(0));
console.log("foobar".replace("bar", "baz"));
console.log("foobar".toUpperCase());

//=============================================
// Other types
//=============================================
// undefined is a type for vars that are not initialized (consts), and null indicate a deliberate non-value
// boolean false is: false, 0, empty string, Nan, null, and undefined. All other values are true
console.log(Boolean(""));
console.log(Boolean(null));
console.log(Boolean(0));
console.log(Boolean("foobar"));
console.log(Boolean("123"));
console.log(null && "123");

//=============================================
// Variables
//=============================================
// no assignment so the var val is 'undefined' (not null).
var v1;
var v2 = "foobar";

// like pythons var declarations escapse their defs blocks. However funcs have scopes. Starting with ECMA6 let and const allow
// block-scoped declarations

//=============================================
// Operators
//=============================================
var v = 3;
console.log(v + 4);
console.log("foo" + "bar");
// bcz javascript parse forward only it adds 3 an 4 then it realizes that the next operand is string
console.log(3 + 4 + "foobar");
//compare with previous line; the + here works as string concatenation
console.log("foobar" + 3 + 4);

// 2 equality operators == which performs type coercion and === which does not
console.log(1 == true); // true since 1 is coerced to boolean true
console.log(1 === true); // false since 1 is not converted and is considered a number
//there are also != and !==
console.log("foobar" == "foobar");

//=============================================
// Control structures
//=============================================
var lang = "German";
var greeting;
if (lang == "German") {
    greeting = "Hallo";
} else if (lang == "French") {
    greeting = "Bonjour";
} else {
    greeting = "Hello"
}
console.log(lang + " - " + greeting);

var i = 0;
while (i++ < 3) {
    console.log("loop" + i);
}
// do-while insure loop is executed at least once similar to java
var j = -3;
do {
    console.log("loop" + j);
} while (j > 5);

// for loop comme toujours
for (var i = 0; i < 3; i++) {
    console.log("fooloop" + i);
}

// && and || operator short-circuit similar to other languages
var str;
var strLen = str && str.length(); // strLen will have undefined val
console.log(strLen);

var strLen2 = str || 7;
console.log(strLen2);

// ternary operator similar to Java
var income = 10000;
var exemptFromTaxes = (income < 12000) ? "yes" : "no";
console.log(exemptFromTaxes);
exemptFromTaxes = (income < 8000) ? true : false;
console.log(exemptFromTaxes);

// switch stmt can work with numbers or strings. Thw switch and case stmts can have expressions (switch(intval + 3), or case 1 + 2
var language = "French";
switch (language) {
    case "French":
        console.log("Salut");
        break;
    case "German":
        console.log("Hallo");
        break;
    default:
        console.log("Hello");
}
