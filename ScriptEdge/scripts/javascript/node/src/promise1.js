/**
 * Created by haytham.aldokanji on 9/15/15.
 */
'use strict';
var promiseCount = 0;

module.exports.testPromise = async function () {
  var thisPromiseCount = ++promiseCount;

  console.log('beforeend', thisPromiseCount +
    ') Started (Sync code started)');

  // We make a new promise: we promise the string 'result' (after waiting 3s)
  var p1 = new Promise(
    // The resolver function is called with the ability to resolve or
    // reject the promise
    function (resolve, reject) {
      console.log('beforeend', thisPromiseCount +
        ') Promise started (Async code started)');
      // This only is an example to create asynchronism
      setTimeout(
        function () {
          // We fulfill the promise or reject it randomly
          if (Math.random() > 0.5)
            resolve(thisPromiseCount);
          else
            reject(thisPromiseCount);
        }, Math.random() * 2000 + 1000);
    });

  // We define what to do when the promise is fulfilled
  // but we only call this if the promise is resolved/fulfilled
  p1.then(
    // Just log the message and a value
    function (val) {
      console.log('beforeend', val +
        ') Promise fulfilled (Async code terminated)');
    })
    .catch(
      // Rejected promises are passed on by Promise.prototype.then(onFulfilled)
      function (reason) {
        console.log('Handle rejected promise (' + reason + ') here.');
      });

  console.log('beforeend', thisPromiseCount +
    ') Promise made (Sync code terminated)');
};
