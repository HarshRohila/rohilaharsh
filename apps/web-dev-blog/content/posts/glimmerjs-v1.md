---
title: 'Using Glimmer.js v1 in Production'
date: 2022-12-18T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
---

## TL;DR

If you are using Glimmer.js v1 in production like me, you can find this [npm package](https://www.npmjs.com/package/glimmer-v1-application-pipeline) which I published, useful. Its original repo is archived, so I forked and started maintaining separate npm package. For now, I only did one change to use the latest TypeScript features with Glimmer.js v1

## What is Glimmer.js

[Glimmer.js](https://glimmerjs.com/) is a lightweight frontend tool like [Preact](https://preactjs.com/) to build components.

## Why we are using it?

- We had a requirement to convert an Ember.js component to web component so it can be used in other apps, no matter what Frontend tooling other apps are using.
- Ember.js is a heavy framework used to build big applications. We needed this component to be lightweight.
- Glimmer.js was created for this purpose only, to build lightweight components, and it was also having a library to convert Glimmer.js components to browser web components

## Challenges with Glimmer.js

- [Glimmer.js](https://github.com/glimmerjs/glimmer.js) team is working on v2 which is still in beta. And v1 is no longer maintained
- So in the project we are not able to use the latest TypeScript features, and use the latest JS features like dynamic importing. It is also not having code splitting.

## Moving ahead

- I want to migrate this component to [Stencil.js](https://stenciljs.com/), which we are using for new web components which we are building, but it will take too much effort.
- So we will wait for v2 to get stable. Till that time, I will try to keep Glimmer.js supporting repositories up to date.
- I created fork of its [pipeline component](https://www.npmjs.com/package/glimmer-v1-application-pipeline)
- Also we are using redux with that component. For that using this [fork](https://github.com/HarshRohila/rollup-plugin-glimmer-redux)
