class Vehicle {
  constructor(seats = 4, brand = 'custom', wheels = 4) {
    this.seats = seats;
    this.brand = brand;
    this.wheels = wheels;
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
  constructor(seats = 6, brand = 'MACK', wheels = 16, load, cargoLen, line) {
    super(seats, brand, wheels);
    this.load = load;
    this.cargoLen = cargoLen;
    this.line = line;
  }
}

let vehicle = new Vehicle(4, 'Ford');
let truck = new Truck(8, 'Mazda', 18, 3, 300, 'NY-NJ');

console.log('vehicle ', vehicle);
console.log('truck  ', truck);


let vehicle2 = new Vehicle();
Object.freeze(vehicle2);
vehicle2.baseColor = 'black';
// will be undefined since we froze the object
console.log(vehicle2.baseColor);
// won't be deleted
delete vehicle2.brand;
console.log(vehicle2.brand);