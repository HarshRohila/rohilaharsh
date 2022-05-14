---
title: 'Stencil for React Devs'
date: 2022-05-09T08:21:03+05:30
author: 'Harsh Rohila'
---

# What is Stencil?

Stencil is one of the best tools out there to build web components.
The following is from Stencil’s official [website](https://stenciljs.com/docs/introduction)

> Stencil is a compiler that generates Web Components (more specifically, Custom Elements). Stencil combines the best concepts of the most popular frameworks into a simple build-time tool.

# Comparison With React

There are many things common in Stencil and React

## JSX/TSX templates

Stencil also uses JSX templates with few differences compared to React

- Uses the HTML `class` attribute to specify class names instead of `className`
- No synthetic events

## Component Type

Stencil uses class components instead of functional components. It is also having [lifecycle hooks](https://stenciljs.com/docs/component-lifecycle) for components.

Stencil is also having functional components, but only stateless or pure components are allowed

## Props and States

It’s having the concept of props and states, the same as in React. Decorators (@State and @Prop) are used to indicate which class’s property is state/prop
The below image shows an example of a Stencil Component

```tsx
import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'my-input',
  shadow: true,
})
export class MyInput {
  @Prop() label?: string;
  @State() value = '';

  render() {
    return (
      <Host>
        <label>
          {this.label ?? 'Text Input'}
          <input type="text" value={this.value} />
        </label>
      </Host>
    );
  }
}
```

## Events and Callbacks

In React, for parent components to know if something happened in the child component, the parent component passes a callback to the child and the child calls that callback.

Stencil uses Browser’s Custom Events API for this instead. The child component emits an Event and the Parent component listens for it. Custom Events are used so that these components can work anywhere (with or without framework/library)
Stencil is having decorators to make it easy to work with Custom Events. Refer to [official docs](https://stenciljs.com/docs/events) to know how to use them
