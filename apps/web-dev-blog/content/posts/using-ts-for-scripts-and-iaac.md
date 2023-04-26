---
title: 'Using TypeScipt for Scripts and IAAC'
date: 2023-04-25T20:07:09+05:30
author: 'Harsh Rohila'
draft: true
---

I am using TypeScript for everything I code, Frontend, Backend, AWS Infrastructure as Code (IAAC), and writing scripts. In this post, I will cover less common scenarios of writing scripts and IAAC in TypeScript.

## Why use TypeScript for writing Scripts?

This is for people who are familiar with TS and don't know bash, to write scripts.

If you are using TS for your daily work, it would be easier to use the same language for scripts for automation as there is no context switching to another language.

[zx](https://www.npmjs.com/package/zx) is a npm package that makes writing JS scripts easier.

To use this with TS, you can use [tsx](https://www.npmjs.com/package/tsx) (ts-node's modern alternative that uses [esbuild](https://esbuild.github.io/)).

### Steps to use

- Usually, I create a `scripts` folder in my Node.js projects and in that folder I create package.json with command 
> `npm init es6 -y`
- Install `zx` and `tsx` using 
> `npm i zx tsx`
- Create script file, `my-script.ts` and add following code
	```ts
	import 'zx/globals'

	const message: string = "Hello World!"
	await $`echo ${message}`

- Above script imports 'zx/globals', to use `$` to run terminal commands. Check zx docs to know what other things get imported, which you can use in scripts.
- Now you can run the script using 
>`npx tsx my-script.ts`.

 It should print the following.

```
$ echo $'Hello World!'
Hello World!
```
- Now you can put this script in package.json scripts, so other devs can know what all scripts are available in this project.
```json
"scripts": {
	"sayHello": "tsx my-script.ts"
}
```
Now you can run with 
> `npm run sayHello`

## Infrastructure as Code (IAAC)
For this, I am using [AWS CDK](https://aws.amazon.com/cdk/).
CDK has first-class TypeScript support. With it, you can create almost all AWS resources on the AWS cloud.

In my organization, we moved from using CloudFormation(which uses JSON) to CDK which reduced lots of boilerplate. 

It also allowed us to reuse code. I used [Nx monorepo](https://nx.dev/) for this. Using Nx I was able to create a library of common CDK code and that is used in all other CDK apps, which standardized the infrastructure.

### CDK Resources
- [API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html) - Whenever looking to create an AWS resource, read "Overview" section of that resource first, which covers most common cases.
- [Constructs Hub](https://constructs.dev/) - This is having lots of Constructs created by the community.
- [Best Practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)




