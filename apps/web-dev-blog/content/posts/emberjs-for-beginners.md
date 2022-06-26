---
title: 'Ember.js for beginners'
date: 2022-06-26T09:40:09+05:30
author: 'Harsh Rohila'
draft: true
---

## Prerequisites

- HTML Basics
- JavaScript basics
- npm packages install commands

Ember.js is a JavaScript tool to build Single Page Apps.

Single Page Apps are Web Apps having only single HTML page (mostly index.html). And all the interactivity in that page is handled by JavaScript.

Ember.js is considered difficult for beginners because of so many terminologies and concepts. But once you know these things you can build things very fast with this framework. And these concepts can be used in other frontend frameworks also. I found most online content which just covers the "what" part of these concepts, not the "why" part. This post will cover "why" part.

## Ember Project Structure

First, lets look at the structure by creating a new Ember Project. Make sure you have Node.js installed

- Install Ember with command

  `npm install -g ember-cli`

- Create Ember Project with name "ember-quickstart"

  `ember new ember-quickstart --lang en`

This will create "ember-quickstart" folder, open that folder in any IDE

See the contents of `app/index.html` file. This is the only HTML file in the project which is why it is a single page app

The `app` folder is the one which will have all the source code of the project. We can build the contends of this folder with command

`ember build --environment=production`

This creates a folder named `dist`, which is having the processed index.html and other files. This folder contents are distributed/deployed to be used by users of your app.

Look at `app/index.html` contents again. You can find 2 script tags, one is loading `ember-quickstart.js` and other is loading `vendor.js`

`ember-quickstart.js` will have all your application code and `vendor.js` will have third party code (which are the packages installed by `npm install <package-name>` commands)

## Start Ember App in Dev mode

Run below command to run project in dev mode

`npm start`

This command will print a localhost URL (http://localhost:4200) when it finishes. Visit that url in browser to see the app running. It shows the contents of the file `app/templates/application.hbs`.

## Templates

`.hbs` files are called Handlebars files. In these files we can write HTML tags for our app. These files are in templates folder. The HTML parts of your app are called templates.

### Why .hbs instead of .html

HTML files are limited in syntax. Handlebar files allow for extra syntax which can be used to write simple template logic like if condition and for loops. E.g.

```hbs
{{#if showHeader}}
  <header>App Header</header>
{{/if}}
<div></div>
```

This double curly bracket syntax allows to write conditional logic in templates. `showHeader` is a JS variable, simply changing that variable value to `false` can remove header from our page, cool right?

Think about how you will do it using JavaScript only. It needs lots of code to do this simple thing.

We can write all HTML of our app in `application.hbs` file. But when our app gets bigger the file size of this file will increase, making it difficult to maintain. For that Ember is having components

## Components

Large Template files (.hbs files) can be divided into smaller templates files. So that it is easier to manage. And these small templates can be used multiple times. These small templates are called components.
