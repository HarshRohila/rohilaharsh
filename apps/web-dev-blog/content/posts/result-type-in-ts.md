---
title: 'Forcing Error Handling in TypeScript: A Result Type Implementation'
date: 2025-08-24T10:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/ts-result-type.webp'
---

## The Problem: Runtime Crashes in TypeScript

Ever found yourself debugging a production issue only to discover that your API call crashed at runtime? You're not alone. In TypeScript, developers often use Promises and forget to handle errors, leading to runtime crashes that could have been prevented at compile time.

Languages like Java have a built-in solution: **checked exceptions**. They force developers to handle potential errors before the code even compiles. But TypeScript? Well, it's a bit more... _forgiving_ (read: dangerous).

## The Rust Inspiration

While searching for a solution, I stumbled upon Rust's elegant `Result` type. It's beautiful in its simplicity:

```rust
// Rust - You MUST handle both success and error cases
match api_call() {
    Ok(data) => process_data(data),
    Err(error) => handle_error(error)
}
```

The compiler won't let you ignore the error case. What if we could bring this level of safety to TypeScript?

## The Solution: A TypeScript Result Type

After some research, I found [this excellent blog post](https://medium.com/@cole.carley/implementing-the-rust-result-type-in-typescript-2c2a93c0c165) that got me started. I took their implementation and enhanced it to fit my needs. Here's what we came up with:

```ts
/**
 * A Result type that can be either Ok or Err.
 * Use this to enforce explicit error handling and prevent runtime errors in your code.
 * Inspired by Rust's Result type.
 *
 * @template T - The type of the value in the Ok case.
 * @template E - The type of the error in the Err case.
 */
class Result<T, E extends NonNullable<unknown> = Error> {
  #ok: T | null
  #err: E | null

  private constructor(ok: T | null, err: E | null) {
    if (ok === null && err === null) {
      throw new Error('Result must have a value or an error')
    }
    if (ok !== null && err !== null) {
      throw new Error('Result cannot have both a value and an error')
    }

    this.#ok = ok
    this.#err = err
  }

  static fromOk<T, E extends NonNullable<unknown>>(value: T): Result<T, E> {
    return new Result(value, null) as Result<T, E>
  }

  static fromErr<T>(error: unknown): Result<T, Error> {
    const err = error instanceof Error ? error : new Error('Unknown error')

    return new Result(null, err) as Result<T, Error>
  }

  unwrap(): this extends Result<T, never> ? T : T | null {
    return this.#ok as T
  }

  isOk(): this is Result<T, never> {
    return this.#ok !== null && this.#err === null
  }

  getErr(): this extends Result<T, never> ? E | null : E {
    return this.#err as E
  }
}

export { Result }
```

## How It Works: The Magic

The beauty of this implementation is in the type system. When you call `unwrap()`, TypeScript knows that the return type depends on whether you've checked for errors first:

- **Before error checking**: `unwrap()` returns `T | null` (potentially unsafe)
- **After error checking**: `unwrap()` returns `T` (guaranteed safe)

## Real-World Usage: Before and After

### ❌ The Old Way (Dangerous)

```ts
// This compiles but can crash at runtime
const callApi = async (): Promise<User> => {
  const response = await fetch('/api/user')
  return response.json() // What if this fails?
}

// Usage - No error handling required by TypeScript
const user = await callApi()
console.log(user.name) // 💥 Runtime error if API fails!
```

### ✅ The New Way (Safe)

```ts
// This forces error handling at compile time
const callApi = async (): Promise<Result<User, ApiError>> => {
  try {
    const response = await fetch('/api/user')
    if (!response.ok) {
      return Result.fromErr(new ApiError(`HTTP ${response.status}`))
    }
    const user = await response.json()
    return Result.fromOk(user)
  } catch (error) {
    return Result.fromErr(error)
  }
}

// Usage - TypeScript forces you to handle errors
const result = await callApi()

if (!result.isOk()) {
  // 🎯 You MUST handle this error case!
  console.error('API failed:', result.getErr())
  return
}

// Now TypeScript knows this is safe
const user = result.unwrap()
console.log(user.name) // ✅ Guaranteed to work
```

## The Compiler Becomes Your Best Friend

Here's the magic: TypeScript will now give you compilation errors when you try to use the result of `unwrap()` without proper error handling:

```ts
const result = await callApi()

// ❌ TypeScript Error: Object is possibly 'null'
const user = result.unwrap() // This compiles, but user is T | null
console.log(user.name) // This won't compile - user might be null!

// ✅ This compiles and is safe
if (result.isOk()) {
  const user = result.unwrap() // Now TypeScript knows it's safe
  console.log(user.name) // This compiles - user is guaranteed to be T
}
```

## Why This Matters

1. **Prevents Runtime Crashes**: Errors are caught at compile time, not runtime
2. **Forces Good Practices**: Developers can't accidentally ignore error cases
3. **Better Debugging**: Error handling is explicit and visible in the code
4. **Type Safety**: TypeScript becomes a true safety net
5. **Team Confidence**: Code reviews become easier when error handling is mandatory

## The Bottom Line

By implementing a Result type in TypeScript, I've brought the safety of Rust's error handling to the JavaScript ecosystem. No more runtime crashes, no more forgotten error handling, and no more production crashes due to unhandled exceptions.

The next time you're building an API client or any function that can fail, consider using `Result<T, E>`. Your future self (and your users) will thank you.

---

_Have you tried implementing error handling patterns like this in TypeScript? I'd love to hear about your experiences in the comments below!_
