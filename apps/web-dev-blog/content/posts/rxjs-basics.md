---
title: 'RxJS Basics'
date: 2022-12-18T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/rxjs-basics.webp'
---

Learning RxJS was difficult for me, but it was totally worth it as it simplifies implementing many complex async features in a frontend app


Now I think of it, its not that difficult. In this post I will try to simplify learning RxJS. I am using RxJS with Stencil.js, so I will cover what is essential in using it in a Front-end app. Let's begin

## Reactive Programming

RxJS is a library using which we can do Reactive programming. Reactive programming is programming with _Streams_

## Streams?

A stream means a stream of values. Below is a comparison of a stream with an array

![Streams](/img/streams.png)

Notice the values of stream having variable gaps between them. The arrow represents time. Unlike array, a stream can emit values over time

This allows treating async and sync code in same way, as async code will emit values as it receives and sync code will also do the same. So we don't need special keywords like async await for handling async code with RxJS.

Let's consider a stream example

> Click "Result" button to view output of code in given examples

{{< codepen id="abRBRpJ" height="300" >}}

Above example creates a stream of numbers using the `of` operator of RxJS
> I am using term "stream" instead of "observable", as its easier to think of. RxJS uses type "Observable" to represent streams. In above example, type of `numbers$` is `Observable<number>`

> Note the convention of putting $ at the end of variable name in case of `numbers$`. This is used to represent streams and can be pronounced as "numbers stream"

Then, `subscribe` function is used to subscribe to stream of numbers. Whenever that stream emits a number, subscribe will execute the callback passed to it, here `print` function

So this code just prints the numbers in the stream

### More on subscription

A stream can do 3 things
- it can emit new value
- it can error
- it can complete

Stream cannot emit values after it raised error or its completed. So the subscribe method we saw in above example is having another form, given below

{{< codepen id="yLRgbLW" height="400" >}}

In this subscribe function, we can pass 3 callbacks for all the 3 things stream can do. This is a finite stream, it completes after emitting 3 values. There can be infinite streams also, which never completes, like stream of mouse clicks `mouseClicks$`

### More comparison with Array
The operations available on arrays like map, filter are also available for streams in RxJS. Other than these operations lots of other operations(for which operators are available in RxJS) we can perform on streams as it can emit values over time

Now lets talk about "Subject" type

## Subject

Let's say we have a stream and many subscribers subscribed to it. Now we want to emit a new value in that stream so all those subscribers can get that new value. The stream we created in above example is not having that capability. That can be done with "Subject"

Let's consider below example

{{< codepen id="QWZddqG" height="400" >}}

In above examples we created a stream using Subject now. Subject is a special type of stream. After a subscriber subscribed to it, we are able to emit new values using `next` function. Above example emitting 2 and 3 and print callback(subscriber) is able to receive those new values

## Behavior Subject

It is a special type of Subject which
- needs initial value to create
- will emit this initial value to new subscribers, if no value emitted yet
- is able to store a value known as current value, you can read current value from this Subject anytime using `stream$.value`
- if no value emitted, initial value is the current value. If value emitted, last emitted value is the current value

In simple terms, it is a Subject which can store a value. This is useful for storing state of a Frontend component

Let's consider an example of this



## Pipe

Streams have a pipe function using which we can apply and chain RxJS operators

Example
{{< codepen id="qBJRmar" >}}

This example is having an input field. Typing in that input field prints output if user stopped typing for 300ms (which is like waiting for user to finish typing)

Let's talk about how this is working

- `fromEvent` operator is used to create stream from input Event of input Element
- `pipe` function is used on stream to use operators, `map` and `debouceTime`
- `map` operator is mapping Event object to value of input element
- `debounceTime(300)` is next in chain, this operator emits value if 300ms passed after last emission, if not passed it will reset this timer.
- Finally, the stream is subscribed and print callback is used which will be called whenever this stream emits
> If debouncing is new for you, you can google more about it, it is having many applications

## Unsubscribe

To avoid memory leaks we need to unsubscribe our subscriptions. To unsubscribe, we need to store the subscription object which we get after subscription and on that we can do unsubscribe

```ts
const subscription = numbers$.subscribe(print)
subscription.unsubscribe();
```

### Preferred way to unsubscribe
There is another way, which doesn't need us to store this subscription object to be unsubscribed later.
RxJS having an operator `takeUntil` which is used as given below

{{< codepen id="QWZdvQe" >}}

In this example
- `interval` operator is used, with parameter 1000, which creates a stream, which emits after every 1000ms/1sec. It is an infinite stream, which emits numbers starting from 0 (0,1,2,...)
- `takeUntil` operator is used with `stop$` parameter, which means keep receiving values until stop$ emits
- `stop$` is emitting after 5 secs using setTimeout, so subscription ends after 5 secs

We usually stop listening from a stream on cause of other event. This example is stopping subscription on stop event. This type is used in Frontend apps, when component wants to stop listening to state changes when its removed from DOM (destroy event)