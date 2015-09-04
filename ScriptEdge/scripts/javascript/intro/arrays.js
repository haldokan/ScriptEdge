/**
 * Created by haytham.aldokanji on 9/1/15.
 */

//=============================================
// Arrays
//=============================================
// similar to objects; they have length property
var a = new Array();
a[0] = "foo";
a[1] = "bar";
console.log(a); // actually prints the array
console.log(a.length);

// more convenient
var a = [1, 2, 3];
console.log(a.length);

// unlike java array they behave like maps
a[10] = 77;
// length is the highest index + 1 = 78
console.log(a.length);
// accessing and element at an index that is not defined returns "undefined"
console.log(a[6]);
// iterate over an array; note how we calculate the len so it is not recalculated at every iteration (unlike Java)
for (var i = 0, len = a.length; i < len; i++) {
    console.log(a[i]);
    if (a[i] === undefined) {
        document.write("|");
    }
}

// iteration can also be done in a fancier way. However this stops at the index of the 1st undefined item since the 'item'
// in the loop is tested for truthfulness at each iteration. This means that we should not use this iteration idiom for integer
// arrays that may have 0 or string arrays that may have empty strings. Arrays of objext or DOM nodes are good candidates for using
// this idiom however.
a[3] = 66;
for (var i = 0, item; item = a[i++];) {
    console.log(item);
}

//adding an element to the array
var a = [11];
a.push(22);
console.log(a);

// iterate using forEach (added in ECMA5)
["foo", "bar", "baz"].forEach(function (currVal, ndx, arr) {
    console.log(ndx + "->" + currVal + "/" + arr.length);
});

// some array methods
var cities = ["NewYork", "NewJersey", "Newark", "Brooklyn", "Bronx", "Hoboken"];
console.log(cities.toString());
//add to the end of the array
cities.push("FortLee", "ColdSprings");
console.log(cities.toString());
// add to the start of the array
cities.unshift("Houston", "LosAngelese");
console.log(cities.toString());
// pop from end of the array
cities.pop();
console.log(cities.toString());
// pop from the start of the arr
cities.shift();
console.log(cities);
// convert to string separated by 'sep'
console.log(cities.join("|"));
// reverse
console.log(cities.reverse());
// slice returns a subarr w/o modifying the original
console.log("slice=> " + cities.slice(2, 5));
console.log("remaining=> " + cities);

// sort(compr funct)
console.log("Sorted=> " + cities.sort());
// sort with comparator func; doesn't seem to work
console.log("Sorted/Compr=> " + cities.sort(function (e1, e2) {
    return e1.length < e2.length;
}));
var cities = ["NewYork", "NewJersey", "Newark", "Brooklyn", "Bronx", "Hoboken"];
// splice: deletes from the array the specified slice and returns the deleted slice.
console.log("spliced1=> " + cities.splice(2, 3));
console.log("remaining1=> " + cities);

var cities = ["NewYork", "NewJersey", "Newark", "Brooklyn", "Bronx", "Hoboken"];
// We can replace the spliced out elems in the array with any number of new items
console.log("spliced2=> " + cities.splice(2, 3, "Phili", "Houston"));
console.log("remaining2=> " + cities);


