---
title: Asynchronous JavaScript
date: '2019-01-26'
spoiler: Everything about asynchronous flow in JavaScript.
---

A Promise is an object representing the eventual completion or failure of an asynchronous operation.
Essentially, a promise is a returned object to which you attach callbacks, instead of passing callbacks into a function.

Unlike callbacks, promises, and by extend async/await which is build on them,
allow one to compose asynchronous code that looks as tho it is synchronous.
Fundamentally this improves readability, and makes it easier to follow, which in turns makes troubleshoot the code easier as well.

Pending promises can become either `fulfilled` with a _value_ or `rejected` with an _error_,
but regardless they are settled with an __outcome__, and the great thing about them is that you can chain them.

Furthermore, unlike passed-in callbacks, promises come with guarantees:
 - Callbacks will never be called before the completion of the current run of the JavaScript event loop.
 - Callbacks added with `then()` even after the success or failure of the asynchronous operation, will be called, as above.
 - Multiple callbacks may be added by calling `then()` several times. Each callback is executed one after another, in the order in which they were inserted.

However, when making promises, it's important to remember that the function passed to a `new Promise` will be executed synchronously.
Or in other words, when you construct a Promise, the first parameter gets executed immediately.

```js
new Promise((resolve, reject) => {
  someFunction((error, value) => {
    if (error) {
      reject(error)
    } else {
      resolve(value)
    }
  })
})
```

In this way we can use resolve() or reject() to create promises from values:

`Promise.resolve(value)` which will return `value`

or

`Promise.reject(error)` which will return `error`

Keeping in mind that if you put a fulfilled promise into a fulfilled promise, they'll collapse into one:

`Promise.resolve(value)` which will also return `value`

Sometimes however you might not need reject, or might not resolve to a value:
```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

In the case where you actually want to delay the executor,
which as already mentioned is called _synchronously by the Promise constructor_.
You could either implement it with a timeout, or call the resolve function as part of other asynchronous functions callback.
```js
function someAsynchronousWork() {
  return new Promise((resolve) => {
    setTimeout(function() {
      const result = doSomeWork();
      resolve(result);
    }, 0);
  });
}
```
In the above example, the `setTimeout` method would call the function on the next tick or in other words, at next possible moment the event que is free.

So getting back to the previously mentioned ability to chain promises.
It's quite common to need to execute two or more asynchronous operations back to back,
where each subsequent operation starts when the previous operation succeeds, and with the result from the previous step.

To accomplish promise chain we use `then()` function which returns a new promise, that's different from the original one.

```js
const promise = doSomething();
const promise2 = promise.then(successCallback, failureCallback);
```

In this case promise2 represents the completion not just of doSomething(),
but also of the `successCallback` or `failureCallback` you passed in,
which can be other asynchronous functions returning a promise.

When that's the case,
any callbacks added to promise2 get queued behind the promise returned by either `successCallback` or `failureCallback`.

```js
new Promise((resolve, reject) => {
    console.log('Chain started step 1');

    resolve();
})
.then(function(result) {
  console.log('Chain continues to step 2');

  return doSomethingElse(result);
})
.then(function(newResult) {
  console.log('Chain continues to step 3');

  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('Got the final result: ' + finalResult);
})
.catch(failureCallback);
```

The arguments to then are optional, and `catch(failureCallback)` is short for `then(null, failureCallback)`.

It's possible to chain after a failure, i.e. a catch,
which is useful to accomplish new actions even after an action failed in the chain.

```js
new Promise((resolve, reject) => {
    console.log('Initial');

    resolve();
})
.then(() => {
    throw new Error('Something failed');

    console.log('Do this');
})
.catch(() => {
    console.log('Do that');
})
.then(() => {
    console.log('Do this, no matter what happened before');
});
```

The above code will execute all the console logs from top to bottom except the second one,
since throwing an error will prevent `console.log('Do this');` from executing (the code is never reached).
However because we handle the emerging error with the catch handler positioned at the exact level where the exception emerges,
what we end up accomplishing is preventing the promise chain from stopping,
and allowing the rest of the sequence to continue as normal.

Next we will discuss [asynchronous generators](/#/).

---
