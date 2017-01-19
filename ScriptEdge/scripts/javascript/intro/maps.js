/**
 * Created by haldokanji on 1/18/17.
 */

const map = new Map([['name', 'John'], ['job', 'Engineer'], ['city', 'Jersey City']]);
console.log(map.entries());
console.log(map.keys());
console.log(map.values());

// the value is the 1st param and the key is the 2nd!
map.forEach((value, key) => console.log(value, key));

console.log('map.get', map.get('name'));
map.set('name', 'Edward');
console.log('map.get', map.get('name'));

map.set('salary', 50000);
console.log('salary', map.get('salary'));

console.log(...map);

const arr1 = ([...map]);
console.log(arr1[0]);

const arr2 = ([...map.keys()]);
console.log(arr2);
