---
title: 'JavaScript Prototype Easy Explaination'
date: 2022-08-15T15:07:09+05:30
author: 'Harsh Rohila'
draft: true
---

JavaScript prototype is an interesting feature which I read about many times, but I forget that easily, because of so many similar terms and concepts. This post aims to be an easy explanation for Prototype feature

# Why Prototype?

For using inheritance

# What is it?

It's a _hidden_ property (denoted by `[[Prototype]]`) in every object. When a property (not present in an object) is accessed, JS tries to find it in that object's Prototype.

- Prototype can be an object or `null` (other values are ignored)
- Because Prototype is itself an object, so a prototype chain is formed

# \_\_proto\_\_

It's just a getter/setter of `[[Prototype]]`. It's not recommended in modern JS. Use `Object.getPrototypeOf(obj)` and `Object.setPrototypeOf(obj, proto)` instead

# Ways to set Prototype of object

## When creating new objects

```ts
// 1. Using __proto__
const obj = {
  __proto__: otherObj, // this is the only usage of __proto__ which is not frowned upon
  a: 1
}

// 2. Using Object.create
const obj = Object.create(otherObj, {
  a: {
    // property descriptors
    value: 1
  }
})

// 3. Using Constructor Function
function F() {}
const obj = new F()
alert(obj.__proto__ == F.prototype) // true
```

## Setting prototype after object creation

- Using setter `Object.setPrototypeOf(obj, proto)`. This works, but not recommended as it affects JS optimizations

# Default prototype of object

By default each object knows its constructor function.

if, `f = new F()`

then, `f.constructor == F`

That is why, the default value of `F.prototype` is `{ constructor: F }`
