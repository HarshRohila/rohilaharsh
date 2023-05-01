---
title: 'Animation on Scroll with Intersection Observer API'
date: 2023-04-30T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/intersection-observer.avif'
---

Recently, in one of my websites I implemented below type of animation on scroll. Try scrolling below list of cards. Notice that the cards are animating only when they are in view.

{{< codepen id="wvYqzma" tab="result" height="600" >}}

In this post I am going to explain its implementation. It's using one of the Browser APIs, called Intersection Observer API.

## What is Intersection Observer API?

- The Intersection Observer API is an API using which we can run a callback if an element intersects any other element.
- The other element can be any ancestor element or [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport).
- The API also provides a way to specify, on how much intersection we want to run the callback.

The animation which I created above is using viewport to check intersection.

Now let's look into code. The code is starting from `main()`

```ts
const observer = getObserver()

const listElements = document.querySelectorAll('li')

for (let i = 0; i < listElements.length; i++) {
  observer.observe(listElements[i])
}
```

- `getObserver()` gets an instance of `IntersectionObserver` class. We will look into that function later below.
- Then the code loops over all list elements and adds them as target to this observer using the `observe` function.
- So this code is simply observing all list elements with an observer.

Now in `getObserver()` function, we have

```ts
let observer = new IntersectionObserver(callback, options)
```

- The instance of `IntersectionObserver` is created with 2 parameters, callback and options.
- Options is for configuring the observer. In our case it looks like below

```ts
const options = {
  threshold: 0.2
}
```

- The threshold is for specifying the extent of intersection. Here 0.2 means 20% intersection. Here, we have not used the `root` option to specify any ancestor element, so by default it considers intersection with the viewport. In short, it will check for 20% intersection(of listElement) with the viewport.

Now, the callback looks like below

```ts
const callback = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show-up')
    } else {
      entry.target.classList.remove('show-up')
    }
  })
}
```

- The callback is having `entries` parameter, which is an array. It is an array because we can add multiple target elements using `observe` function on `IntersectionObserver`'s object. So each entry represents an entry for a target element(in our case targets are the list elements).
- Note that, the callback can be called for each list element in 2 cases. When element is scrolled into view, it will be the case of 0.0 intersection to 0.2 intersection. And other case is when list element is scrolled out of view. From 0.2 intersection to 0.0. Its called both times as both times its crossing the 0.2 intersection mark. To differentiate between these 2, `isIntersecting` is provided in each entry. If `isIntersecting` is true, it means the element is scrolled into view.
- So when the element is scrolled into view, `show-up` class is added to it and when it is scrolled out of view `show-up` class is removed.

Now, let's look into CSS.

```SCSS
li {
  transition: opacity 1s;
  opacity: 0;
  transform: scale(0.8);
  transition-property: opacity, transform;

  &.show-up {
    opacity: 1;
    transform: scale(1);
  }
}
```

> SCSS is used in this example. CSS equivalent of `&.show-up` in above case is `li.show-up`

- [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) is used for animation.
- `li` element having default/initial styles without `show-up` class. With `show-up` class, styles for final state are given.
- Transition is used for `opacity` and `transform` properties.

## Resources

- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - For knowing more about Intersection Observer API
