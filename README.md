# concise-awaituntil
Adds ".catch()" exception handling behavior to Javascript's Async/Await while avoiding Try/Catch blocks and Promise catch blocks.

## In Summary 
Change this:
```
function doWhatever() {
  somethingAsync()
    .then(success => handleAsyncSuccess(success))
    .catch(error => handleAsyncError(error))
}
```
To this:
```
async function doWhatever() {
  const [ success, failure ] = await until(somethingAsync())
  if (failure) handleAsyncError(failure)
  else handleAsyncSuccess(success)
}

```


### Background
Javascript's **Await** operator makes asynchronous functions cleaner and easier to reason about because they are wrote like and resemble syncronous code.  It is an upgrade (in my opinion) from promise based asynchronous handling which employs ".then()" and ".catch()" calls.

Prepending **aysnc** infront of the keyword **function** enables the use of the **await** keyword inside of that function's body.  Allowing us to no longer chain functions together via the ".then()" and ".catch()" calls.  It does this by implementing the ".then()" behavior behind the scenes for us.  The lines following after the "await" line act as if they were inside of the ".then()" code block, but we never see that logic structure.

**However, although Javascript's Async/Await implements a ".then()" behind the scenes for us, it does not implement a ".catch()"** as the first example included.  So while using Async/Await, if there is an exception thrown (not the same thing as a rejected promise) by either your code or a 3rd party library/service during the async function, it is not caught.  And if there is no ".catch()" for an exception the program will terminate.  Therefore, your code may (and probably will) break.

To get around this missing ".catch()" block in Javascript's Async/Await, programmers may implement a ".catch()" by using a Try/Catch block.

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

I believe the heart behind Javascript's Async/Await was to avoid promise-like code in the first place.  So concise-awaituntil allows exception handling while keeping the code as clean as possible.  Here is an example:

```
const until = require('concise-awaituntil')

async function doWhatever() {
  const [ success, failure ] = await until(somethingAsync())
  if (failure) handleSomethingAsyncFailure(failure))
  else handleSomethingAsyncSuccess(success))
}
```
In the example above, the **until** function will always return a two item array.  Which can be deconstructed in the following manner:

```
  const [ outcome, failure ] = await until(somethingAsync())
```

The *failure* item, which is item two (index 1) will represent a rejected promise but will also catch thrown exceptions.  Item one (index 0) will represent a successful outcome (resolved promise data).  One of these two items in the array will always be truthy, the other will always be falsy (null to be exact).  If outcome is truthy, failure will always be null and vice versa.  Therefore the function **until** is easily testable and you can call the correct handler of the outcome.  The failure handler can further determine (if needed) if the outcome was rejected or a thrown exception.  The calling function doWhatever() should not have this responsibility.  This Async/Await code block is now able to catch exceptions while being clean and concise.  At the same time also avoiding Try/Catch blocks or ".then()" and ".catch()" promise syntax.
