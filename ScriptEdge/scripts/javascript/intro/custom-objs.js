/**
 * Created by Vehicle.aldokanji on 9/3/15.
 */

// associating funcs to objects; in javascript there are no classes - here's 1st attempt that we will improve later
function dateFormatter(year, month, day) {
    return {
        year: year,
        month: month,
        day: day,
        // note the use of 'this'.
        usFormat: function() {
            return this.month + "/" + this.day + "/" + this.year;
        },

        euFormat: function() {
            return this.day + "/" + this.month + "/" + this.year;
        }
    };
}
// The 'this' used inside the function is the 'formatter' below since we use the dot notation to call the function
var formatter = dateFormatter(2015, 9, 3);
console.log(formatter.usFormat());
console.log(formatter.euFormat());

// We will improve the dateFormatter by using constructor functions: those which are created using the 'new' keyword. Their
// names are capitalized by convention to indicate that they should be created using new. Cntr funcs don't return values
function usFormat() {
    return this.month + "/" + this.day + "/" + this.year;
}

function euFormat() {
    return this.day + "/" + this.month + "/" + this.year;
}

function DateFormat(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
    // note that we are not making calls to the funcs here, rather we are assigning their refs to local vars in this func. Calling
    // the funcs will happen once we create an instance of this cntr function.
    this.usFormatFunc = usFormat;
    this.euFormatFunc = euFormat;
}

var dateFmt = new DateFormat(2015, 9, 2);
console.log("USfmt=>" + dateFmt.usFormatFunc());
console.log("EUfmt=>" + dateFmt.euFormatFunc());

// Can we do better? Yes using prototypes. Associate the functions with prototype with is a build in object associate with
// all the instances of a func. When accessing a field on a function obj javascript looks first then for the fields defined
// in the func, and if not found follow the prototype chain. We can add fields and funds to prototype at runtime
function DateFormat2(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
}

DateFormat2.prototype.usFormatFunc = function() {
    return this.month + "/" + this.day + "/" + this.year;
};

DateFormat2.prototype.euFormatFunc = function() {
    return this.day + "/" + this.month + "/" + this.year;
};
var dateFmt2 = new DateFormat2(2015, 9, 2);
console.log("USfmt2=>" + dateFmt2.usFormatFunc());
console.log("EUfmt2=>" + dateFmt2.euFormatFunc());

// new funcs can be added to the prototypes of built in objects like string. We can add a func 'reverse' for example to
// the string object. but let's override the default toString() method in DateFormat2.prototype
DateFormat2.prototype.toString = function() {
    return "DateFormat2: year = " + this.year + ", month = " + this.month + ", day = " + this.day;
};
console.log(dateFmt2.toString());

// functions can be defined inside other funcs. That can be used for encapsulation and redusing the num of funcs in the global space
// innder funcs have access to the vars of their outer funcs -> closures. More on that later on
//apply is used to specify the 'this' in function calls - to illustrate that we will impl javascript 'new' (w/o the prototype)
// this is not something we would be doing often
function basicNew(cntr, args) {
    var newObj = {};
    cntr.apply(newObj, args); // apply can take an arr or a comman-sep list of args
    return newObj;
}
// basicNew(DateFormat2, arr) is roughly equivalent to new DateFormat2(arr)
var dateFmt3 = basicNew(DateFormat2, [2015, 9, 4]);
console.log("basicNew=> " + dateFmt3.year + "/" + dateFmt3.month + "/" + dateFmt3.day);

// 'call' also used to specify the 'this' for a func
var dateFmt4 = new DateFormat2(2015, 8, 16);
function expired(badStorage, badTransport) {
    return this.year <= 2015 && this.month < 8 || badStorage || badTransport;
}
console.log("expired1=> " + expired.call(dateFmt4, true, false));
console.log("expired2=> " + expired.call(dateFmt4, false, false));

// Closures in javascript are similar to those of Python. Here's what we call 'partial' in python
// note how the closure is used to keep the state around for the 'taxer' function; that's why closure can be used to keep
// state instead of using objects.
function taxing(state) {
    var taxer = function(income) {
        if (state === "NY") {
            return income * 0.70;
        } else if (state === "NJ") {
            return income * 0.65;
        } else {
            return undefined;
        }
    };
    return taxer;
}
//get a NY taxer
var nyTaxer = taxing("NY");
// get a NJ taxer
var njTaxer = taxing("NJ");

// apply ny and nj taxes to income
console.log("nyTax=> " + nyTaxer(1000));
console.log("njTax=> " + njTaxer(1000));
