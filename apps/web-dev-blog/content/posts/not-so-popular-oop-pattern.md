---
title: 'A not so popular class pattern - TypeScript'
date: 2022-06-09T09:29:09+05:30
author: 'Harsh Rohila'
draft: true
---

TypeScript is a flexible language. Using it you can write code doing the same thing in N number of ways. This can be considered as both disadvantage and advantage of the language.

Disadvantage being, people need to know so many things to understand variety of code.

I consider this as a good thing, as it offers developers so many ways to express what code is doing. Developers can use that to make code more readable according to different situations.

This post is to share one of the patterns I am using for months now for writing code in Object-Oriented way.

Let's first look at the most popular way to define class

```ts
class Pattern {
  #name: string

  constructor(name: string) {
    this.#name = name
  }

  displayName() {
    console.log(this.#name)
  }
}
```

> If you are seeing # first time. It is the newly introduced, most ugly syntax in the language to use private properties

This class can be used like this

```ts
const popularPattern = new Pattern('Popular')
popularPattern.displayName()
```

Now let's look at the code doing the same thing differently

```ts
const Pattern = {
  create(name: string) {
    function displayName() {
      console.log(name)
    }

    const publicAPI = {
      displayName
    }

    return publicAPI
  }
}
```

This can be used as

```ts
const notPopularPattern = Pattern.create('Not Popular')
notPopularPattern.displayName()
```

This is called [Factory](https://www.freecodecamp.org/news/class-vs-factory-function-exploring-the-way-forward-73258b6a8d15) method.

Pros of using this way

1. `this` keyword is not used. `this` keyword in JavaScript, as you maybe already knowing, is according to context. No need to worry about `this` is not having correct value.

2. Fewer concepts used. Not using keywords like `class`, `this`, `#`, `constructor`

3. You can keep the function name and definition separate. So you can keep all the functions in an object(here `publicAPI`) object to quickly know what is public.

4. Easy mocking. If you are using `Jest`, it is as simple as

```ts
Pattern.create = jest.fn()
```

Let's look at a class example with more concepts to know how it can be mapped to Factory method

```ts
class Pattern {
  static displayClassName() {
    console.log('Pattern')
  }

  #name: string

  constructor(name: string) {
    this.#name = name
  }

  #privateDisplayName() {
    console.log(this.#name)
  }

  displayName() {
    this.#privateDisplayName()
  }
}
```

I added static method and a private function

Factory way can look like

```ts
const Pattern = {
  displayClassName() {
    console.log('Pattern')
  },

  create(name: string) {
    function privateDisplayName() {
      console.log(name)
    }
    function displayName() {
      privateDisplayName()
    }

    const publicAPI = {
      displayName
    }

    return publicAPI
  }
}
```

Using static method is same in both patterns

```ts
Pattern.displayClassName()
```
