---
title: 'Using RxJS with Stencil.js'
date: 2023-04-22T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/rxjs.png'
---

RxJS is mainly popular with Angular Developers. In this post, I am going to share how I used RxJS with Stencil.js to build reactive components.

Ideas in this post should be applicable to other Frontend techs too.

> This post assumes familiarity with RxJS, check my [RxJS basics post](/posts/rxjs-basics) for that

> [Show me the code]({{<ref "#projectlinks" >}}) 




## Reactive components

A frontend component will usually have some state,
let's represent that state by `state$` (pronounced as state stream).

> I am using the word "stream" to refer to Observable, as it's just a stream of values.

This `state$` will emit values whenever the state changes. The component can subscribe to this state$ to know when to update.

```ts
state$.subscribe(updateComponentState)
```

`updateComponentState` is a function that will do changes according to the framework we are using, in Stencil.js it will update `@State()` variables so stencil knows when to update the view.

Now, let's try to define state$.

### Defining state$

Our component will have some initial state and the state of the component can change if a user is doing some events (like typing in an input field, or clicking a button) in our component. Let's represent user events by streams userEvent1$, userEvent2$, ...

So we can represent the state$ as,
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
Whenever userEvent1 occurs it will run the logic 1 and will update in state$, similarly, it can work for other events.

Note that, we need to define logic 1, and logic 2 only once, then UI should work, the events will run through the logic pipeline to update the state.

Based on this understanding let's define all these more concretely.

- Because we need to update state$ on user events and those state changes should be available to the component which already subscribed to state$, we can use `Subject` for this. Using subject we can do `state$.next(newState)` and that will put the new state in state$. And this subject will need to hold some value, so we can use `BehaviorSubject`.
- Because of similar reasons, we can use `Subject` for userEvent streams also, but these streams don't need to hold values, so it can use `Subject` only instead of `BehaviorSubject`.


Let's define the type of our State. I am considering an example of a To-Do App, so we will store Todos.

```ts
interface State {
	todos: Todo[]
}

interface Todo {
	id: string
	text: string
}
```

Let's define the initial state of our component.

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

Now the state$ can be defined as,

```ts
const state$ = new BehaviourSubject<State>(initialState)
```

```ts
state$.subscribe(updateComponentState)
```

To avoid memory leaks, we also need to unsubscribe. Instead of unsubscribe, we can just complete the stream on disconnect/destroy of the component.

For that RxJS has `takeUntil` operator. Let's use that.

```ts
state$.pipe(
	takeUntil(disconnected$)
).subscribe(updateComponentState)
```

But where to put this code?

To listen for all state changes we need to do this once before rendering of the component.

Stencil having `componentWillLoad` hook for that. Let's put this in.

```ts
componentWillLoad() {
	state$.pipe(
		takeUntil(disconnected$)
	).subscribe(updateComponentState)
}
```

Let's define the `disconnected$` stream now, as that's easy. You can think of `disconnected$` as an event which occurrs in component and on that event we need to stop subscribing to state changes

Stencil.js has `disconnectedCallback` hook for knowing when the component is disconnected from the DOM.

But we need this in stream form to be able to use it with RxJS. We can use `Subject` for this, as it can emit value when the component is disconnected.

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

Now we would like the component file to be a simple view file that will just subscribe to the state$ and will emit events, some other file can have logic to manage states and events.

Let's create a file `facade.ts`, in that file we will have the state$.

> A facade is a design pattern to expose a simple interface masking more complex code. The idea of creating a facade is taken from this [blog post](https://thomasburlesonia.medium.com/ngrx-facades-better-state-management-82a04b9a1e39).

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

Let's add a Delete todo feature. For that, the user can click on a button next to a todo to delete it.

Its template can look like below.

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

The event handler for delete can look like the below.
```ts
deleteTodoEvent = events.createDeleteEvent(this.disconnected$);

private createDeleteTodoHandler = (todo: Todo) => {
	const deleteTodoHandler = () => {
		this.deleteTodoEvent.emit(todo);
	};

	return deleteTodoHandler;
};
```

Where `events` is defined in the `facade.ts` file below

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

