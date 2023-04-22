---
title: 'Using RxJS with Stencil.js'
date: 2023-04-22T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/rxjs.png'
---

RxJS is mainly popular with Angular Developers. In this post I am going to share how I used RxJS with Stencil.js to build reactive components

Ideas in this post should be applicable for other Frontend techs too

> This post assumes familiarity with RxJS, check my [RxJS basics post](/posts/rxjs-basics) for that

> [Show me the code]({{<ref "#projectlinks" >}}) 




## Reactive components

A frontend component will usually have some state,
lets represent that state by `state$` (pronounced as state stream)

> I am using word "stream" to refer to Observable, as its just a stream of values

This `state$` will emit values whenever state changes.
The component can subscribe to this state$ to know when to update

```ts
state$.subscribe(updateComponentState)
```

`updateComponentState` is a function which will do changes according to framework we are using, in Stencil.js it will update `@State()` variables so stencil knows when to update view

Now, lets try to define state$

### Defining state$

Our component will have some initial state and the state of component can change if user is doing some events(like typing in input field, clicking button) in our component, lets represent user events by streams userEvent1$, userEvent2$, ...

So we can represent state$ as
```ts
state$ = of(initialState)

userEvent1$.pipe(
	// logic 1
).subscribe(update(state$))

userEvent2$.pipe(
	// logic 2
).subscribe(update(state$))
.
.
.
```
Whenever userEvent1 occurs it will run the logic 1 and will update in state$, similarly it can work for other events

Note that, we need to define logic 1, logic 2 only once, then UI should work, event will run through logic pipeline to update state

Based on this understanding lets define all thees more concretely

- Because we need to update state$ on user events and those state changes should be available to the component which already subscribed to state$, we can use `Subject` for this. Using subject we can do `state$.next(newState)` and that will put new state in state$. And this subject will need to hold some value, so we can use `BehaviorSubject`
- Because of similar reasons we can use `Subject` for userEvent streams also, but these streams don't need to hold values, so it can use `Subject` only instead of `BehaviorSubject`


Let's define type of our State. I am considering example of a To-Do App, so we will store Todos

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

Lets define `disconnected$` stream now, as that's easy. You can think of `disconnected$` as an event which occured in component and on that event we need to stop subscribing to state changes

Stencil.js having `disconnectedCallback` hook for knowing when the component is disconnected from the DOM

But we need this in stream form to be able to use with RxJS. We can use `Subject` for this, as it can emit value when component is disconnected.

```ts
disconnected$ = new Subject<void>()

componentWillLoad() {
	state$.pipe(
		takeUntil(disconnected$)
	).subscribe(updateComponentState)
}

disconnectedCallback() {
	disconnected$.next()
	disconnected$.complete()
}
```

Now we would like the component file to be a simple view file which will just subscribe to state$ and will emit events, some other file will can have logic to manage states and events

Lets create a file `facade.ts` in that file we will have state$
> Facade is a design pattern to expose a simple interface masking more complex code

```ts
// facade.ts
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
export const state$ = new BehaviourSubject<State>(initialState)
```

## User Events

Let's add a Delete todo feature. For that user can click on a button next to a todo to delete it

Its template can look like below

```jsx
render() {
	return <ul>
		{this.todos.map((todo) => (
			<li>
				{todo.text}
				<button onClick={this.createDeleteTodoHandler(todo)}>X</button>
			</li>
		))}
	</ul>
}

```

Event handler for delete can look like below
```ts
deleteTodoEvent = events.createDeleteEvent(this.disconnected$);

private createDeleteTodoHandler = (todo: Todo) => {
	const deleteTodoHandler = () => {
		this.deleteTodoEvent.emit(todo);
	};

	return deleteTodoHandler;
};
```

where `events` is defined in `facade.ts` file as below

```ts
// facade.ts
export const events = {
  createDeleteEvent(disconnected$: Subject<void>) {
    const deleteEvent$ = new Subject<Todo>();

    deleteEvent$.pipe(
      takeUntil(disconnected$)
    ).subscribe((todo) => {
      setState({ todos: state$.value.todos.filter((t) => t.id !== todo.id) });
    });

    return {
      emit(todo: Todo) {
        deleteEvent$.next(todo);
      },
    };
  },
};
```

## ProjectLinks
- [Codesandbox](https://codesandbox.io/p/sandbox/polished-dew-he9q05) - Simple To-Do app with delete feature
- [Github repo](https://github.com/HarshRohila/stencil-rxjs/tree/master/src/components/todo-app) - To-Do app with many features

