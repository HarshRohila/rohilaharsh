---
title: 'Callback Pattern'
date: 2024-03-01T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/callback_cover.jpeg'
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

Also, JS is not the only language having this, it is there in many languages, but might not be very straight forward. In Java, Lambda feature can do the same thing

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

This is a powerful feature. Because we can have function in variable we can pass it around. We can pass it as parameter to other functions, which can make code more readable or [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

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

You're maybe wondering why someone will do this. Well yes, this is a trivial example, but this can be useful when the sum function is an async function. Consider below snippet.

```JS
httpGet("https://some-api.com/users", logger)

```

Here, lets say `httpGet` is making a HTTP GET request to given API. We don't know when that API will finish, so we pass a callback to it. When it will finish it can run the callback, so we can get result in our passed function.

Callback returning error is a common pattern in such cases. E.g.

```JS
httpGet("https://some-api.com/users", function processResult(err, result) {
  if (err) logger("Failed")
  else logger(result)
})
```

This was very common before Promise API came in JS. Now most libraries have converted this Callback type of API to Promises.

But that doesn't mean callbacks are not used anymore.

## More callback use cases

### Open-Close scenarios

Consider cases in which we need to do 2 opposite operations, like file open-close, memory allocate and memory de-allocate. Code for file operations can look like below

```JS
let fileDesc = file.open()
processFile(fileDesc)
file.close()
```

Lets say you are doing this multiple times in your code. That means, every time you need to write open and close function calls, that is repetition of code. Also, developer may forget to close the file, or in case of memory, developer can forget to clear memory.

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
fileProcessor(function logContents(fileDesc) {
  console.log(fileDesc.contents)
})
```

Above code will automatically open and close file every time we call it. We just need to pass `fileProcessor` function a parameter(function) which will process the file.

### Single place Error Handling

I was using Supabase database in one of my projects. Its Query Database API looks like below

```JS
const { data, error } = await supabase
  .from('countries')
  .select('name')
```

I wanted to do single place error handling for each of the query database operations I will do in my app. Note that, these queries will be different for different types of data and these will be at multiple places in codebase. Can you think of a solution for doing single place error handling in this case?

One way can be, create a function(lets say `dbQuery`) which will call this query function and we can do error handling in `dbQuery` function. It can look like below

```js
async function dbQuery(supabaseQuery) {
  const { data, error } = await supabaseQuery()

  if (isErrorOfMyInterest(error)) throw new MyCustomError()

  return data
}
```

Now you can use this `dbQuery` function in any place of your app like below

```js
dbQuery(() => {
  return supabase.from('countries').select('name')
})
```

Now all supabase queries' errors will get handled, and we have written error handling at single place only. This is using callback pattern only, as we are passing callback to `dbQuery` function.

These are the few examples of how callback patterns can be used. Hope you found this interesting.
