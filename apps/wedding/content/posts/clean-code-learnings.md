---
title: 'Clean Code Book Summary'
description: 'What I learnt from the book'
date: 2022-05-16T08:41:09+05:30
author: 'Harsh Rohila'
featured_image: '/img/clean-code.png'
---

The book [Clean Code](https://www.amazon.in/Clean-Code-Robert-C-Martin/dp/8131773388) by Robert C Martin, changed the way I think about and write code.

## Why Clean Code?

Have a look at the image below which is from the book

![Image showing Code Review](/img/clean-code.png)

I love this image. It clearly shows the frustration of developers reading bad code.

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

More the number of parameters of a function, the more difficult is to understand it

Functions with 0 or 1 parameters are good. 2 are still not so complicated, but 3 should be very rare

Parameters can be reduced by creating classes/objects. If you notice that same set of parameters are passed to multiple functions, this indicates that a concept is hidden in that. Those functions can be grouped into a class(having name of the concept) and that class's constructor can take those common parameters. So those functions will not need to be passed parameters as they can use it from private properties.

## Avoid Comments

Commented code is useless if we are using version control system like Git. We can easily see previous versions of files using it. Also, such comments lose its meaning after few months/years. People will forget why it was commented, or those comments will move to some other line after many changes in that file. Most readers will ignore such comment.

Commented explanation of code indicates failure to write readable code. Instead of comments, code should be refactored to make more sense. Also commented explanation is repetition of information already expressed in code form, which is violation DRY principle.

## Meaningful Names

- Class names should be nouns like `Processor`, `Customer`
- Method names should be verbs like `getPage`. Prefixes like `get`, `set` and `is` can be used to indicate if method is getting, setting a value or checking a condition, respectively. e.g. `getName`, `setEmail`, `isHoliday`

## Avoiding use of `else`

This is not what I found in clean code, but in a [video](https://youtu.be/EumXak7TyQ0)

Avoiding `else` makes code easy to read

Consider this

```ts
if (condition) {
  doThis()
} else {
  doThat()
}
```

`else` can be avoided by early return

```ts
if (condition) {
  doThis()
  return
}
doThat()
```

Or in case of assignments default values can be used, instead of assigned default value in else block

```ts
let a = 'default'
if (condition) {
  a = 'changed'
}
```

For nested if-else, separate function can be created for nested if-else block and early return can be used
