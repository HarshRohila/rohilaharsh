---
title: 'Clean Code Learnings'
date: 2022-05-16T08:41:09+05:30
draft: true
author: 'Harsh Rohila'
---

[Clean Code](https://www.amazon.in/Clean-Code-Robert-C-Martin/dp/8131773388) book by Robert C Martin, changed the way I think and write code.

## Why Clean Code

Clean code leads to code which other developers can understand quickly. Developers can easily change code without breaking any existing features.

A code which takes more time to make changes and is difficult to understand will decrease the team productivity

This post summarizes key learnings from the book

## Unit Tests

A code is not clean if it is not having unit tests.

To understand the importance of unit tests, consider this questions

- How do you know if the changes you did in code are not breaking existing features? Are you going to test them again _manually_?

Unit tests can remove the manual testing. So it speeds up development, removing the manual step

- Refactoring - Now you know better way to code, are you going to change old code to use the new way or are you scared to touch existing code?

Unit tests remove the fear of touching existing code. Avoiding change to existing code is not the solution. Making the code easily changeable is the way to go.

## Abstraction

Many of you maybe familiar with OOP's Abstraction, but here I am referring to abstraction while
