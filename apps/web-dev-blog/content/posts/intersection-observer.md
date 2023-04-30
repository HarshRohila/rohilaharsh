---
title: 'Animation on Scroll with Intersection Observer API'
date: 2023-04-30T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/rxjs-basics.webp'
---

Recently, on one of my websites I implemented below type of animation on scroll. Try scrolling below list of cards. Notice that the cards are animating only when they are in view.

{{< codepen id="wvYqzma" tab="result" height="600" >}}

In this post I am going to explain its implementation.

## Intersection Observer API

The Intersection Observer API is an API provided in browser using which we can run callback if element intersects other elements, or it intersects the viewport.

The Intersection Observer API, as the name suggests, provides an API to observe changes in the intersection of an element with an ancestor element (or the top level [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport)).

We can run some code(using callback) if element intersects ancestor and can also specify on how much intersection the callback should run.

The above scrolling animation, is applying an
