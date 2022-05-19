---
title: 'Top 10 Tools I found productive when working with TypeScript'
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

[WSL](https://docs.microsoft.com/en-us/windows/wsl/about) 2 lets you experience actual Linux on Windows.

I have seen most Windows users using Git bash. Git bash lets you run most common Linux commands, but it is slow.

After using WSL 2 you will not get back to Git bash

And you will notice speed difference when working with Node.js tools. Checkout [this](https://levelup.gitconnected.com/working-with-front-end-tools-on-linux-and-windows-the-grand-performance-test-b51a77a71636)

## 3. Windows Terminal (windows only)

[Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-in&gl=IN) comes preinstalled in Windows 11. It lets you open multiple terminals in same window

## 4. Fish Shell

Install [fish shell](https://fishshell.com/) to add modern features to your terminal without any configurations

### Top features

1. _Suggestions_ - Typing shows suggestion from history

- Ctrl+F to complete that suggestion
- Ctrl+P for previous suggestion
- Ctrl+N for next suggestion

2. _Highlighting_ - Shows word in red if command is invalid, blue if valid

There are some minor differences from bash which you would want to know before using it. See [this](https://fishshell.com/docs/current/fish_for_bash_users.html#fish-for-bash-users)

## 5. Starship Prompt

After installing fish your terminal would already look better, but it can become awesome after installing
[Starship](https://starship.rs/guide/#%F0%9F%9A%80-installation)

It shows branch name and Node.js version in your shell prompt.

If you are using AWS, it also shows the selected AWS profile and region, which is useful when switching between AWS profiles.

It makes you feel like 10x developer 😎

## 6. VIM Family

I would mention 3 tools in this category

- vim - Text Editor
- [Vimium](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb?hl=en) - Browser Extension
- [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) - vscode extension

These tools avoid the use of mouse, saving you some time

You may be familiar with vi/vim text editor. It feels very different from the most mouse based editors. And initially it is difficult to use.

These tools need some practice getting used to. I would recommend trying Vimium browser extension first, as it makes browsing the web fast. We spend most of our time browsing the web, so it adds a lot of value there.

### Top features

- Search among bookmarks to open something
- Search among open tabs for quick navigation to that tab
- Clicking links without using mouse

Then you can move to using Vim VS Code extension, to start using some vim shortcuts. This [tutorial](https://www.barbarianmeetscoding.com/blog/boost-your-coding-fu-with-vscode-and-vim) is highly recommended for this

And you can try vim text editor to quickly create/edit single files. Like editing configuration files like `.bashrc`

## 7. GitLens VS Code plugin

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) makes working with Git easy

### Top features

- Shows which line is changed by whom, with its commit details
- Compare any branch with any other branch/commit
- Easy to use interactive rebase options like squash, drop

## 8. Husky

[Husky](https://typicode.github.io/husky/#/) lets you run commands on events of git. Like running your tests command before every `git push`. Linting commit messages, checkout [commitizen](https://www.npmjs.com/package/commitizen)

## 9. Jest VS Code plugins

If you are using Jest for unit testing. Install [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) and [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) plugins. These helps to quickly find which test is failing, debug the test and running tests on every save for quick feedback of the code which just changed.

## 10. PNPM

[PNPM](https://pnpm.io/) Performant NPM, as the name suggests is a fast package manager.

NPM package manager stores all dependencies in node_modules of project, but PNPM stores them globally to allow sharing for modules between projects to saving disk space and quick installation of dependencies.

Switching to PNPM from NPM is easy, just use `pnpm import`, and it will create its own lock file `pnpm-lock.yaml` from `package-lock.json` file
