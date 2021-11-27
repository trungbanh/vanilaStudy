// have 3 state
/**
 * 1. Pending
 * 2. Fulfilled 
 * 3. Rejected
 */


var promise = new Promise(
  // Executor 
  function (resolve, reject) {
    // khi thanh cong goi resolve
    // khi that bai goi reject

    resolve("haha");
  }
)

promise
  .then(function (data) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve("kaka")
      }, 300)
    })
  })
  .then(function (data) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve("blabla")
      }, 300)
    })
  })
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.error(error);
  })
  .finally(function () {
    console.info("done");
  })

var promise1 = new Promise(
  // Executor 
  function (resolve, reject) {
    setTimeout(function () {
      resolve('hello ');
    }, 2200)
  }
)

var promise2 = new Promise(
  // Executor 
  function (resolve, reject) {
    setTimeout(function () {
      resolve('world !!!');
    }, 3300)
  }
)

var promise_all = Promise.all([promise1, promise2]);

promise_all.then(function ([result1, result2]) {
  console.log(result1.concat(result2));
})
