'use strict';

// The JSON.stringify() method converts a JavaScript value to a JSON string, optionally replacing values if a replacer
// function is specified, or optionally including only the specified properties if a replacer array is specified.

let profile = {
  id: {
    name: 'joe', ssn: 123
  },
  address: {
    mail: { town: 'Orange', state: 'NJ' },
    email: { type: 'business', value: 'joe@gmail.com' }
  }
};

function replacer (key, value) {
  console.log('key is[' + key + "]");
  if (key === 'email') {
    console.log('the KEY!');
    return value;
  }

  return undefined;
  //
  // console.log(key);
  // // Filtering out properties
  // if (typeof value === "string") {
  //   return undefined;
  // }
  // return value;
}

let email = JSON.stringify(profile, replacer);
// let email = JSON.stringify(profile, function (key, value) {
//   console.log(value, '\n');
//   if (key === 'email') {
//     return value;
//   }
//   return undefined;
// });
console.log('email is', email);

function destructure (uuid) {
  console.log({ uuid });
}

destructure('foo');
