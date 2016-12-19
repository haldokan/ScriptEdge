'use strict';

let vehicle = {
  seats: 4,
  brand: 'custom',
  wheels: 4,
  // note that an arrow func ()=> will not work here; does not play well with inheritance scoping.
  // using Ecma6 shottend notation for defining a func
  xtlLicenseRequired() {
    return this.wheels > 16;
  },
  get summary() {
    return this.brand + '-' + this.wheels;
  },
  set brandSpecs(specs) {
    this.brand = this.brand + "-" + specs;
  }
};

let truck = {
  load: 3,
  cargoLen: 100,
  line: 'NY-NJ',
  wheels: 17,
  //ecma6 shortend syntax for functions
  loadFactor(adjustor) {
    return adjustor * (3 / 100);
  }
};
console.log(truck.hasOwnProperty('load'));

Object.setPrototypeOf(truck, vehicle);

console.log(truck.wheels);
console.log(Object.getPrototypeOf(truck).wheels);

// create an object that inherits truck (truck becomes its proto type)
var superTruck = Object.create(truck);

console.log(superTruck.hasOwnProperty('brand'));

console.log(superTruck.brand);
console.log(superTruck.wheels);

// setting a property on superTruck makes it its own
superTruck.brand = 'Mazda';
console.log(superTruck.hasOwnProperty('brand'));
console.log(superTruck.brand);
console.log(Object.getPrototypeOf(superTruck).brand);

superTruck.load = 10;
console.log(superTruck.load);
console.log(Object.getPrototypeOf(superTruck).load);

superTruck.wheels = 22;
console.log(superTruck.wheels);

console.log(vehicle.xtlLicenseRequired());
console.log(truck.xtlLicenseRequired());
console.log(superTruck.xtlLicenseRequired());

console.log(superTruck.summary);
console.log(superTruck.brand);

vehicle.brandSpecs = "XXSS";
console.log(vehicle.brand);
console.log(vehicle.summary);

superTruck.brandSpecs = 'XXLG';
console.log(superTruck.brand);
console.log(superTruck.summary);

const date = Date.prototype;
Object.defineProperty(date, "year", {
  get: function () {
    return this.getFullYear()
  },
  set: function (y) {
    this.setFullYear(y)
  }
});

const now = new Date();
console.log(now.year);
console.log(now);
now.year = 2001;
console.log(now);

console.log(truck.loadFactor(2));