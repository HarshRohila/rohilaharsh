---
title: 'Callback Pattern'
date: 2024-03-01T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/rxjs_zip_cover.jpeg'
---

## A different view of Functions

People experienced in JS have a different view of functions compared to people new to JS coming from background of C, C++, Java.

Consider below JS function

```js
let sum = function (a, b) {
  return a + b
}
```

The idea of storing a function in variable might seem weird to new JS developers, but this is a powerful feature of JS. This can be used in interesting ways.

Also, JS is not the only language having this, it is there in many languages, but might not be very straight forward, like in Java, Lambda is doing the same thing

```java
import java.util.function.Consumer;

Consumer<Integer> method = (n) -> { System.out.println(n); };
```

And in C++, function pointer can achieve the same

```C++
int multiply(int a, int b) { return a * b; }

int (*func)(int, int);

func = multiply

```

This is a powerful feature because it allows functions to be passed as parameters to other functions, and can make code more readable or [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

## Callback Pattern

A callback is a function passed as parameter to a function. Wherever this is done, I will refer that as Callback pattern.

In many cases, a function is passed as last parameter of function to process the result. Consider below example.

```JS
function sum(a, b, callback) {
  let result =  a + b;
  callback(result)
}

function logger(message) {
  console.log(message)
}

sum(3, 5, logger); // this will output 8

```

In above code, logger function is passed as parameter to sum function, So logger is a callback function. After sum is done, it calls the callback function with result, so callback function can process the result.

> Note: To remember this, you can say we are passing a function A to other function B to be "called back" when B is done. Hence, callback. The control returns back to A when B is done.

You're maybe wondering someone will do this. Well yes, this is a trivial example, but this can be useful when sum is an async operation. Consider below snippet.

```JS
httpGet("https://some-api.com/users", logger)

```

Here, lets say httpGet is making a HTTP GET request to given API. We don't know when that API will finish, so we pass a callback to it. When it will finish it can run the callback, so we can get result in our passed function.

Callback returning error is a common patter in such cases. E.g.

```JS
httpGet("https://some-api.com/users", function processResult(err, result) {
  if (err) logger("Failed")
  else logger(result)
})
```

This was very common before Promise API came in JS, now most libraries have converted this Callback type of API to Promises.

But that doesn't mean callbacks are not used anymore.

## More callback use cases

### Open-Close scenarios

Consider cases in which we need to do 2 opposite operations, like file open-close, memory allocate and memory de-allocate. Code for file can look like below

```JS
let fileDesc = file.open()
processFile(fileDesc)
file.close()
```

Lets say you are doing this multiple times in your code. So every time you need to write open and close, that is repetition of code. Also Developer may forget to close file, or in case of memory, Dev can forget to clear memory.

To avoid repetition of code we can create a function like below

```JS
function fileProcessor(processFile) {
  let fileDesc = file.open()
  processFile(fileDesc)
  file.close()
}
```

Now this can be used multiple times in your code like below.

```JS
fileProcessor(function logContents () {
  console.log(fileDesc.contents)
})
```

Above code will automatically open and close file every time, we just need to pass `fileProcessor` function a parameter(function) which will process file.
