/**
 * Created by haytham.aldokanji on 9/3/15.
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
var formatter = dateFormatter(2015, 09, 03);
document.writeln(formatter.usFormat());
document.writeln(formatter.euFormat());

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

var dateFmt = new DateFormat(2015, 09, 02);
document.writeln("USfmt=>" + dateFmt.usFormatFunc());
document.writeln("EUfmt=>" + dateFmt.euFormatFunc());

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
var dateFmt2 = new DateFormat2(2015, 09, 02);
document.writeln("USfmt2=>" + dateFmt2.usFormatFunc());
document.writeln("EUfmt2=>" + dateFmt2.euFormatFunc());

// new funcs can be added to the prototypes of built in objects like string. We can add a func 'reverse' for example to
// the string object. but let's override the default toString() method in DateFormat2.prototype
DateFormat2.prototype.toString = function() {
    return "DateFormat2: year = " + this.year + ", month = " + this.month + ", day = " + this.day;
};
document.writeln(dateFmt2.toString());

// functions can be defined inside other funcs. That can be used for encapsulation and reduding the num of funcs in the global space

// apply and call: specifiy the object that should be used as 'this' in functions

