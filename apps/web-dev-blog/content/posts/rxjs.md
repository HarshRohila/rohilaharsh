---
title: 'Using RxJS with Stencil.js'
date: 2022-12-18T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/glimmer.png'
---

RxJS is mainly popular with Angular Developers. In this post I am going to share how I used RxJS with Stencil.js to build reactive components

Ideas in this post should be applicable to other Frontend techs too

> This post assumes familiarity with RxJS, check my [RxJS basics post](/posts/rxjs-basics) for that

## Thinking of reactive components

A frontend component will usually have some state,
lets represent that state by `state$` (pronounced as state stream)

> I am using word "stream" to refer to Observable, as its just a stream of values

This `state$` will emit values whenever state changes.
The component can subscribe to this state$ to know when to update

For storing state we can use `BehaviorSubject` available in RxJS. Its a special type of Subject and a Subject is a special type of stream

Subject: using this stream we can produce/emit values in the stream

BehaviorSubject: is a Subject which can hold state (or last produced/emitted value)

Lets define type of our State. Lets say we are building a Todo component, so we will store todos

```ts
interface State {
	todos: Todo[]
}

interface Todo {
	id: string
	text: string
}
```

Lets define some initial state of our component

```ts
const initialState: State = {
	todos: [
		{
			id: "1",
			text: "First Todo"
		},
		{
			id: "2",
			text: "Second Todo"
		}
	]
}
```

Now state$ can be defined
```ts
const state$ = new BehaviourSubject<State>(initialState)
```

```ts
state$.subscribe(updateComponentState)
```
> Here `updateComponentState` is a function to update component state which is not defined yet

To avoid memory leak, we also need to unsubscribe. Instead of unsubscribe, we can just complete the stream on disconnect/destroy of component

For that RxJS having `takeUntil` operator. Lets use that

```ts
state$.pipe(
	takeUntil(disconnected$)
).subscribe(updateComponentState)
```

But where to put this code?

To listen for all state changes we need to do this once before render of component

Stencil having `componentWillLoad` hook for that. Lets put this in

```ts
componentWillLoad() {
	state$.pipe(
		takeUntil(disconnected$)
	).subscribe(updateComponentState)
}
```

Lets define `disconnected$` stream now as that's easy. You can think of `disconnected$` as an event which occured in component and on that event we need to stop subscribing to state changes

Stencil.js having `disconnectedCallback` hook for knowing when component is disconnected from DOM

But we need in stream form to be able to use with RxJS.
RxJS having `Subject` for these cases. `Subject` is a special type of stream for which we can emit values ourselves. So we will emit when component is disconnected.

```ts
disconnected$ = new Subject<void>()

componentWillLoad() {
	state$.pipe(
		takeUntil(disconnected$)
	).subscribe(updateComponentState)
}

disconnectedCallback() {
	disconnected$.next()
}
```
