'use strict';

let greeting = 'Hello There!';
let greetingItr = greeting[Symbol.iterator]();

console.log(greetingItr.toString());

let cursor = greetingItr.next();

while (cursor.done === false) {
  console.log(cursor.value);
  cursor = greetingItr.next();
}
//spread operator turns a string to an array of chars
[..."foobar"].forEach(function (chr) {
  console.log(chr);
});

for (let value of ['a', 'b', 'c']) {
  console.log(value);
}
let fname, lname, job;
[fname, lname, job] = new Set(['John', 'Brown', 'Janitor']);
console.log(fname, lname, job);

let citySet = new Set(['New York', 'New Jersey', 'Princeton', 'Houston', 'DC']);
console.log(citySet);

let cityArr = Array.from(citySet);
console.log(cityArr);

let cityArr2 = Array.from(citySet, (city) => {
  return 'city of ' + city;
});
console.log(cityArr2);

let citySet2 = new Set(['New York', 'Ottawa', 'Princeton', 'Toronto', 'DC']);

// sets intersection - the spread operator (...) turns the set to arr
let cityIntersection = new Set([...cityArr].filter((city) => citySet2.has(city)));
console.log('intersection: ', cityIntersection);

// sets difference
let cityDiff = new Set([...cityArr].filter((city) => !citySet2.has(city)));
console.log('intersection: ', cityDiff);

// maps - can be constructed from 2d-array
let livingStandards = new Map([['US', 4], ['UK', 4], ['Sweden', 5], ['Portugal', 3]]);
livingStandards.set('Canada', 4.5);

// this works w/o referencing entries
for (let [country, grade] of livingStandards.entries()) {
  console.log(country, grade);
}
console.log(livingStandards.get('UK'));

// turn map to a 2d-array using the spread operator (...)
let livingStandardsArr = [...livingStandards];
console.log(livingStandardsArr);