class Vehicle {
  constructor() {
    this.seats = 4;
    this.brand = 'custom';
    this.wheels = 4;
  }

  xtlLicenseRequired() {
    return this.wheels > 16;
  }

  get summary() {
    return this.brand + '-' + this.wheels;
  }

  set brandSpecs(specs) {
    this.brand = this.brand + "-" + specs;
  }
}

class Truck extends Vehicle {
  constructor() {
    super();
    this.load = 3;
    this.cargoLen = 100;
    this.line = 'NY-NJ';
    this.wheels = 17;
  }
}

let vehicle = new Vehicle();

// freeze prevent other code from adding, changing or deleting properties from and object - 'seal' only prevents deletion
Object.freeze(vehicle);
console.log(Object.isFrozen(vehicle));
vehicle.baseColor = 'black';
// will be undefined since we froze the object
console.log(vehicle.baseColor);

// won't be deleted
delete vehicle.brand;
console.log(vehicle.brand);

// cannot change a property value either on a frozen object
vehicle.brand = 'Ford';
console.log(vehicle.brand);