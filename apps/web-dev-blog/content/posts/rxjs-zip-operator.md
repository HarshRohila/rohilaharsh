---
title: 'RxJS Zip Operator Use Case'
date: 2024-03-01T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/rxjs_zip_cover.jpeg'
---

I like writing RxJS code. It makes it easy to combine async logic with sync and it treats both of these things in same way.

Recently, at my work, I used `zip` operator for the first time. I used this in a NestJS project. This operator is not commonly used. In this post I will share for which problem I used it and how it was used.

## The Problem

I have an array of input objects. I want to make stored procedure(SP) call for each of them. But each SP call will return an output which will modify the next input (for the next SP call).

So basically, I need to loop the input array but for each element I should consider the last result from last SP call, use that result to create new input and use that new input for the next SP call.

An imperative, non RxJS solution can look like below.

```ts
async function imperativeApproach(inputs): Promise<Output[]> {
  let lastResult,
    output = []

  for (input of inputs) {
    input = newInput(input, lastResult)
    const result = await spCall(input)
    output.push(result)

    lastResult = result
  }

  return output
}
```

And more declarative RxJS solution looks like below

```ts
function rxjsApproach(): Observable<Output[]> {
  const lastResult$ = new Subject<Output>()

  return zip(from(inputs), lastResult$.startWith(undefined)).pipe(
    switchMap(function makeSpCall(input, lastResult) {
      const input = newInput(input, lastResult)
      return spCall(input)
    }),
    tap(function pushResult(result) {
      lastResult$.next(result)
    }),
    toArray()
  )
}
```

I went with RxJS solution as this project is not using Observables only instead of Promises.

## Explanation of RxJS Solution

- `lastResult$` is stream of last result from SP call
- Initially as we are not making any SP call, we are using initial value as `undefined` for lastResult$ stream using `lastResult$.startWith(undefined)`
- `from` operator converts inputs array to Observable which will emit one value at a time.
- `zip` operator will emit values in pairs,

  [1st value from inputs, 1st value from lastResult$], [2nd value from inputs, 2nd value from lastResult$]... and so on.

  Its marble diagram is below

  ![Zip operator Marble Diagram](/img/zip_operator.png)

- We are making SP call using the new input calculated from pair [input, lastResult]
- After getting new result, its pushed to lastResult$ Subject.
  > Note: Its not considerd good practice to use `tap` as its for side effects. And using Subject is avoided too. But I am not sure how we can do this without them. Let me know if you have any ideas.
- `toArray` is used to collect all the values emitted into array, and this array is returned.
