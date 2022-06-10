---
title: 'A not so popular class pattern - TypeScript'
date: 2022-06-09T09:29:09+05:30
author: 'Harsh Rohila'
draft: false
---

TypeScript is a flexible language. Using it you can write code doing the same thing in multiple ways. This can be considered as both disadvantage and advantage of the language.

Disadvantage being, people need to know so many things to understand variety of codebases.

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

> If you are seeing # first time. It is the newly introduced, most ugly syntax in the language to use private properties and methods

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

This may look weird at first. But now you can easily recognize this pattern in codebases.

This is using a [Factory](https://www.freecodecamp.org/news/class-vs-factory-function-exploring-the-way-forward-73258b6a8d15) function(create) to create objects

> For readers of the book "You don't know JS Yet". This is inspired by the example given in the [book](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch2.md) with a little variation of using a top level `const`. With this variation we can directly use functions in other modules without renaming them at imports. Also, it allows easy mocking (see pros below)

_Pros of using this way_

1. `this` keyword is not used. `this` keyword in JavaScript, as you maybe already knowing, is according to context. No need to worry about `this` is not having correct value.

2. Fewer concepts used. Not using keywords like `class`, `this`, `#`, `constructor`

3. You can keep the function name and definition separate. So you can keep all the functions in an object(here `publicAPI`) object to quickly know what is public.

4. Easy mocking. If you are using `Jest`, it is as simple as

```ts
Pattern.create = jest.fn()
```

_Cons_

1. Memory consumption - In Factory way, each object having its own set of public functions. Whereas in `class` way, public methods are shared between objects. So factory way takes more memory, but this only becomes significant if we create thousands of the same object. [Reference](https://www.freecodecamp.org/news/removing-javascripts-this-keyword-makes-it-a-better-language-here-s-why-db28060cc086/)

Let's look at a class example with more concepts to know how they can be mapped to Factory pattern

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

## Bonus

### Not so popular `export` pattern

I noticed most code bases use export at the end, or export individual things by using export for each thing

I like to keep export at the top, just below the imports, to easily know the module's public API without scrolling down to the bottom of the file

```ts
import { Magic, doMagic } from 'some-magic'

export { MyMagic }
```
