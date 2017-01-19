'use strict';

const str = "a,b,c,d";
const arr = str.split(',');

for (let chr of arr) {
  console.log(chr);
}

const toStr = arr.join(',');
console.log(toStr);
