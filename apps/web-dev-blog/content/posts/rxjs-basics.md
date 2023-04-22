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

Lets consider a stream example

> Click "Result" button to view output of code in given examples

{{< codepen id="abRBRpJ" height="300" >}}

Above example creates a stream of numbers using the `of` operator of RxJS
> I am using term "stream" instead of "observable", as its easier to think of. RxJS uses type "Observable" to represent streams. In above example, type of `numbers$` is `Observable<number>`

Then, `subscribe` function is used to subscribe to stream of numbers. Whenever that stream emits a number, subscribe will execute the callback passed to it, here `print` function

So this code just prints the numbers in the stream

