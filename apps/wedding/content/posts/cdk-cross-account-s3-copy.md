---
title: 'AWS CDK Cross Account S3 Copy'
date: 2022-08-31T23:00:09+05:30
author: 'Harsh Rohila'
draft: true
---

When trying to create an AWS CDK CodePipeline to copy a file from one S3 to other S3 bucket in different account, I found that it's not easy. The AWS documentation is not simple to follow. It took too much time to figure out how to make that work. This post tries to simplify that

I did this using CDK v2

# Some important CDK concepts

- Every CDK app needs a Bootstrap Stack, to be able to deploy
- To create a Bootstrap Stack in a region of an account, `cdk bootstrap <account>/<region>` command is used
- By default cdk bootstrap creates a stack with name CDK-Toolkit
