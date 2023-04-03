---
title: 'Why I love TypeScript'
date: 2022-06-18T20:07:09+05:30
author: 'Harsh Rohila'
draft: true
---

I am working as Full Stack Engineer. And I am using TypeScript to do everything, be it Frontend, Backend and even DevOps

TypeScript compiles to JavaScript. So lets first see why JavaScript is awesome.

## Intuitive syntax

I was doing C++ in my college days. I started learning JavaScript at my first job. I started with this awesome website https://javascript.info/.
The easy-to-understand syntax made me fan of this language.

Let me give some examples by comparing with other languages

### Function Declaration

To create function JavaScript having `function` keyword.

- Python uses keyword `def` - Not intuitive at all.

- C++, Java which do not use any special keyword for functions. So it's not easy for new programmers

- Kotlin, Rust which uses shortened words `fun` and `fn`. This is ok, but not better than JavaScript 😛

## Class Declaration

JavaScript having `class` keyword for classes. It's common in many languages.

## Map and Arrays

Theses are simply like how most people visualize them

```ts
const map = {
	key1: 'value1'
	key2: 'value2'
}

const array = [1, 2, 3]
```

## Functions are like value

JavaScript allows functions to be stored in variables and to be passed as parameters to functions, just like values

```ts
const sum = function (a, b) {
  return a + b
}
```

Coming from C++ background this was weird at first. But now I love this, we can do cool things with this feature

## Objects are like maps

Objects and maps are different concepts when I knew only C++ and Java. JavaScript connected these 2 things in an awesome way. Properties of objects are key value pairs only. And the functions are key value pairs too, if we consider function name as key and its definition as its value. Cool, right?

## Language itself is asynchronous

Tasks which do not wait for each other to finish, to start their execution are called asynchronous tasks. These are very easy to implement compared to using threads in other languages.
