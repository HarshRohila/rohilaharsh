---
title: 'Tools I found productive when working with TypeScript/JavaScript'
date: 2022-05-16T08:01:01+05:30
draft: true
author: 'Harsh Rohila'
---

## 1. Volta

Are you telling your team to install a particular version of Node.js for a project? Or working with multiple projects requiring different Node.js versions

With [Volta](https://volta.sh/) you can install multiple Node.js versions and can pin Node.js version for a project

`volta install node@v14.17.3` will install Node.js v14.17.3

`volta pin node@16.15.0` will add entry in `package.json` file for Node v16.15.0

Volta will automatically switch Node versions for projects with pinned Node.js version

## 2. WSL (windows only)

WSL 2 lets you experience actual Linux on Windows.

I have seen most Windows users using Git bash. Git bash lets you run most common Linux commands, but it is slow.

After using WSL 2 you will not get back to Git bash

And you will notice speed difference when working with Node.js tools. Checkout [this](https://levelup.gitconnected.com/working-with-front-end-tools-on-linux-and-windows-the-grand-performance-test-b51a77a71636)

## 4. Windows Terminal (windows only)

Comes preinstalled in Windows 11. It lets you open multiple terminals in same window

## 5. Fish Shell

Install [fish shell](https://fishshell.com/) to add modern features to your terminal without any configurations

### Top features

1. Suggestions - Typing shows suggestion from history

- Ctrl+F to complete that suggestion
- Ctrl+P for previous suggestion
- Ctrl+N next

2. Highlighting - Shows word in red if command is invalid, blue if valid

There are some minor differences from bash which you would want to know before using it. See [this](https://fishshell.com/docs/current/fish_for_bash_users.html#fish-for-bash-users)

## 2. Starship Prompt

After installing fish your terminal would already look better, but it can become awesome after installing
[Starship](https://starship.rs/guide/#%F0%9F%9A%80-installation)

It shows branch name and Node.js version in your shell prompt.

If you are using AWS, it also shows the selected AWS profile and region, which is useful when switching between AWS profiles.

It makes you feel like 10x developer 😎

## 6. VIM Family

I would mention 2 tools in this category

- vim - Text Editor
- [Vimium](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en) - Browser Extension
- [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) - vscode extension

These tools avoid the use of mouse, saving you some time

You may be familiar with vi/vim text editor. Its feels very different from the most mouse based editors. And initially it is difficult to use.

These tools need some practice getting used to. I would recommend trying Vimium browser extension first, as it makes browsing the web fast. We spend most of our time browsing the web, so it adds lots of value there.

Then you can move to using Vim vscode extension, to start using some vim shortcuts

And you can try vim text editor to quickly create/edit single files. Like editing configuration files like `.bashrc`
