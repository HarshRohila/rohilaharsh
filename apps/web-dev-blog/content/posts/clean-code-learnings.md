---
title: 'Clean Code Learnings'
date: 2022-05-16T08:41:09+05:30
draft: true
author: 'Harsh Rohila'
---

[Clean Code](https://www.amazon.in/Clean-Code-Robert-C-Martin/dp/8131773388) book by Robert C Martin, changed the way I think and write code.

## Why Clean Code

Clean code leads to code which other developers can understand quickly. Developers can easily change code without breaking any existing features.

A code which takes more time to make changes and is difficult to understand will decrease the team productivity

This post summarizes key learnings from the book

## Unit Tests

A code is not clean if it is not having unit tests.

To understand the importance of unit tests, consider this questions

- How do you know if the changes you did in code are not breaking existing features? Are you going to test them again _manually_?

Unit tests can remove the manual testing. So it speeds up development, removing the manual step

- Refactoring - Now you know better way to code, are you going to change old code to use the new way or are you scared to touch existing code?

Unit tests remove the fear of touching existing code. Avoiding change to existing code is not the solution. Making the code easily changeable is the way to go.

## Abstraction

Consider you are reading a code which is interacting with different systems to get/send data to and then in same function (which you are reading) some low level calculations like some math operation or concatenation is done, this type of code is considered as rude.

High level concepts should be separated from low level concepts.

Code can be written like a high quality reading material where reader can quickly read the overview to know what is the content or in case of code, quickly know what the system is doing. And then reader can go into low level implementations wherever its required to change the code. This can save time of reader avoiding him to read unnecessary low level implementations.

## Command Query Separation

The functions can be written in a way that puts them in one of the categories (Command or Query) to make them easy to reason about

A function which is a Command will not return any value, that means it will do some side effect, means it is changing the state of the system. E.g. `setPrice(newPrice)`

A function which is a Query will return something, and it will not have any side effects. A Query without parameter will just return a value. A Query with parameters will just operate on its parameters to return a result. It can also be called a pure function. E.g. `getPrice()`, `sum(1,2)`. Pure functions will always return same value if parameters are not changed. It is easy to write tests for such functions.

## Avoid returning `null` or Error codes

If `null` is returned from a function, the caller of the function will immediately need to handle the case if value is `null`. Not handling such cases can raise the famous error `NullPointerException`.

### How to avoid `null`?

In cases where function returns a list of values, `null` can be replaced with empty list. And if parent functions are using functional programming constructs like filter, map, reduce, these gracefully work with empty lists.

In case if function not returning a list, an error can be thrown to indicate failed to return value or missing value.

Languages like Java can force to handle such errors in caller function.

In TypeScript, a union of return type can be used to force caller to handler error type. The function can look like

```ts
function getResult(): Result | Err {}
```

### Function returning error codes

Returning error codes will cause the caller to immediately handle all the different types of codes. Error can be thrown instead. So that caller function can use try-catch to handle the error in catch block.

Using try-catch separates the happy path from error path and clearly indicates code is handling errors

## Reducing function parameters

## Avoiding use of `else`
