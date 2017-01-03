'use strict';

//The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects
// to a target object. It will return the target object.
function testAssign() {
  let param1 = {w: 1.3, l: 7.2, h: 2.2};
  //'w' is overwritten by the last 'w' value encountered in the parameter list
  let param2 = {town: 'Jersey City', state: 'New Jersey', w: '2.8 cm'};
  let copy = Object.assign({}, param1, param2);

  console.log('assign', copy);
}


// For deep cloning, we need to use other alternatives because Object.assign() copies property values. If the source value
// is a reference to an object, it only copies that reference value.

function testDeepCloning() {
  let profile = {
    id: {
      name: 'joe', ssn: 123
    },
    address: {
      mail: {town: 'Orange', state: 'NJ'},
      email: {type: 'business', value: 'joe@gmail.com'}
    }
  };

  // shallow (ref values are copied)
  let copy1 = Object.assign({}, profile);
  let copy2 = Object.assign({}, profile);
  // deep clone: we can achieve deep cloning by using 'parse' and 'stringify': basically converting the java script object
  // to a JSON object then parsing it to a different object again
  let deepCopy = JSON.parse(JSON.stringify(profile));

  // assign copies the reference value so changing the ref value will affect the copies
  profile.address.mail = 'Orange, NJ';

  console.log('shallow copy', copy1);
  console.log('shallow copy', copy2);
  console.log('deep copy', deepCopy);

}

testAssign();
testDeepCloning();