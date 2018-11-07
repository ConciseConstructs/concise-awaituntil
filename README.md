# concise-awaituntil
Adds ".catch()" exception handling behavior to Javascript's Async/Await while avoiding Try/Catch blocks and Promise catch blocks.

## Background
Javascript's **Await** operator makes asynchronous functions cleaner and easier to reason about because they are wrote and resemble syncronous code.  It is an upgrade (in my opinion) from promise based asynchronous handling which employs ".then()" and ".catch()" calls.

A basic Promise based asynchronous code block would look something like this:

```
function doWhatever() {
  somethingAsync()
    .then(outcome => handleSomethingAsyncSuccess(outcome)) // Some outcome...good or bad
    .catch(error => handleSomethingAsyncError(error)) // Exception was thrown
}
```
With Async Await it can be cleaner and more concise by simplifying it to just this:

```
async function doWhatever() {
  const outcome = await somethingAsync()
  if (!outcome) handleSomethingAsyncError(error)) // Async behavior was rejected
  else handleSomethingAsyncSuccess(outcome)) // Async behavior was resolved
}
```

Prefecaing **aysnc** infront of the keyword **function** enables the use the **await** keyword inside of that function's body.  Allowing us to no longer chain functions together via the ".then()" and ".catch()" calls.  It does this by implementing the ".then()" behavior behind the scenes for us.  The lines following after the "await" line act as if they were inside of the ".then()" code block, but we never see that logic.

In the previous example, if there was no outcome...

```
  if (!outcome) handleSomethingAsyncError(error))
```
Then the promise was rejected, otherwise there is an outcome which means the promise was resolved.

However, although Javascript's Async/Await implements a ".then()" behind the scenes for us, it does not implement a ".catch()" as the first example included.  So if there is an exception thrown (not the same thing as a rejected promise) by either your code or a 3rd party library/service during the async function, it is not caught.  Therefore, your code may (and probably will) break.  Without catching the exception debugging can inefficient.

To get around this missing ".catch()" block in Javascript's Async/Await, programmers implement a ".catch()" by using a Try/Catch block.

```
async function doWhatever() {
  try {
    const outcome = await somethingAsync()
    if (!outcome) handleSomethingAsyncError(error)) // Promise was rejected
    else handleSomethingAsyncSuccess(outcome)) // Promise was resolved
  } catch(exception) { 
    handleSomethingAsyncException(exception) // Exception was thrown
   }
}
```

Although this is common, it may not be necessary to use the Try/Catch structure since a solitary ".catch()" can be chained to the "behind the scenes" promise.

```
async function doWhatever() {
  const outcome = await somethingAsync()
    .catch(exception) { 
      handleSomethingAsyncException(exception) // Exception was thrown
    }
  if (!outcome) handleSomethingAsyncError(error)) // Promise was rejected
  else handleSomethingAsyncSuccess(outcome)) // Promise was resolved
}
```

I believe the heart behind Javascript's Async/Await was to avoid promise-like code in the first place.  So I concise-awaituntil to allow exception handling while keep the code as clean as possible.  Here is an example:

```
const until = require('concise-asyncawaituntil')

async function doWhatever() {
  const [ success, failure ] = await until(somethingAsync())
  if (failure) handleSomethingAsyncFailure(failure))            // Async behavior threw exception or was rejected
  else handleSomethingAsyncSuccess(success))                   // Async behavior was resolved
}
```

The until function will always return a two item array.  Which can be deconstructed in the following manner:

```
  const [ outcome, failure ] = await until(somethingAsync())
```

Item one (index 0) will always be the outcome (promise resolved data).  Item two (index 1) will always be either an exception or promise rejection.  One of these two items in the array will always be truthy, the other will always be falsy (null to be exact).  If outcome is truthy, failure will always be falsy and vice versa.  Therefore **until** is easily testable and can call the correct handler of the outcome.  While the Async/Await code block is able to catch exceptions while being clean and concise also avoiding Try/Catch blcoks or ".then()" and ".catch()" promise syntax.



