---
title: 'RxJS Basics'
date: 2022-12-18T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/glimmer.png'
---

Learning RxJS was difficult for me, but it was totally worth it as it simplifies implementing many complex async features in a frontend app


Now I think of it, its not that difficult. In this post I will try to simplify learning RxJS. I am using RxJS with Stencil.js, so I will cover what is essential in using it in a Front-end app. Let's begin

## Reactive Programming

Using RxJS we can do reactive programming. But what is it? Reactive programming is programming with Streams

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

### More comparison with Array
The operations available on arrays like map, filter are also available for streams in RxJS. Other than these operations lots of other operations we can perform on streams as it can emit values over time

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

{{< codepen id="poxRRxW" >}}
