'use strict';

let vehicle = {
  seats: 4,
  brand: 'Ford',
  wheels: 4,
  previousOwners: ['John', 'James', 'Jeo', 'Joshua', 'Jasmine', 'Jared', 'Jane', 'Jeb'],
  // note that an arrow func ()=> will not work here; does not play well with inheritance scoping.
  // using Ecma6 shottend notation for defining a func
  xtlLicenseRequired() {
    return this.wheels > 16;
  },
  // generator methods E6 notation - generator funcs must have yield
  * ownerIterator(prefix) {
    let index = 0;
    let arrLen = this.previousOwners.length; // want to avoid re-calc at every iteration

    while (index < arrLen) {
      yield prefix + "-" + this.previousOwners[index++];
    }
  },
  // computed property name - crazy!
  ['myCrazyFunc' + 1]() {
    return 'Oh Dear!'
  },

  get summary() {
    return this.brand + '-' + this.wheels;
  },
  set brandSpecs(specs) {
    this.brand = this.brand + '-' + specs;
  }
};

let owners = vehicle.ownerIterator('owner');
let itr = owners.next(); // support 'return' to end iteration and 'throw' to throw an error

while (itr.done === false) {
  console.log(itr.value);
  itr = owners.next();
}

// calling computed property/func
console.log(vehicle.myCrazyFunc1()); //=> Oh Dear!

let base = {prop1: 'foo'};
let derived = {prop2: 'bar'};

Object.setPrototypeOf(derived, base);
derived.prop1 = 'baz';

// the output - the horror! Prototypical inheritance: it adds a new prop to 'derived' even tho there is one on 'base'
console.log(base.prop1);
console.log(derived.prop1);