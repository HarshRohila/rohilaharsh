---
title: 'Kubernetes, using TypeScript'
date: 2024-03-02T09:29:13+05:30
author: 'Harsh Rohila'
draft: true
featured_image: '/img/k8s.png'
---

At my work, I learned Kubernetes and used that to migrate an old API project. It required lots of learning and research. In this post, I will share my learnings, so it can help others getting started with Kubernetes.

## Kubernetes Cluster

- To use Kubernetes, we need a Kubernetes Cluster. I used [AWS EKS](https://aws.amazon.com/eks/) for that. EKS can be used with AWS Fargate and EC2 instances. I went with Fargate.
- To create most things in AWS, AWS CDK can be used. But there is already an open source project [CDK EKS blueprint](https://aws-quickstart.github.io/cdk-eks-blueprints/getting-started/) which is abstraction over CDK and simplifies creating EKS cluster in AWS. I used this only, using TypeScript.

## API Service

- API Service is what you can deploy in Kubernetes Cluster. I used [NestJS](https://nestjs.com/) framework for creating API. This is having in-built TypeScript support.
- This service needs to be containerized to be able to deployed in EKS cluster. So I created a Dockerfile for this and pushed the image created to AWS ECR (which is AWS's container repository).

## Kubernetes Resources

- To create anything in Kubernetes cluster, we need to create Kubernetes Resources, like service, deployment.
- For a general API project you need a service and a deployment resource.
- Deployment resource will contain container image path(ECR path) from where EKS can pull image and create containers for your API.
- Service resource will expose your API to be referenced at other places in Kubernetes Cluster. In my App I used Kubernetes Ingress resource too(for load balancer) and in ingress configuration I referenced the service name.
- To create all these Kubernetes resources, I used open-source project [cdk8s](https://cdk8s.io/). Using this you can use TypeScript to define Kubernetes Resources. The cdk8s app when built generates yml files which you can push to your Kubernetes cluster.

## Scaling

- I used horizontal scaling. Based on number of requests the number of containers would scale. For that I installed [KEDA Kubernetes plugin](https://keda.sh/).
- This plugin I configured to get the number of requests from AWS CloudWatch and set minimum and maximum containers that it can scale to.

## CI/CD

- Our code lives in Azure Repos, so I used azure pipelines for CI. Azure pipeline will build NestJS project. This pipeline also pushed the built artifacts to AWS S3, along with Dockerfile (to create image).
- I used AWS CDK to create a AWS codepipline, that takes the NestJS artifacts and Dockerfile to create Docker Image from it. This Docker image is saved as zip file in S3 (to be later used by other codepipeline).
- I created another Codepipeline using AWS CDK, this will take the Image Zip file and push the zip in ECR. This pipeline also deploys the CDK EKS blueprint app to create EKS cluster. And this also deploys the cdk8s app to create Kubernetes resources.

I tried to simplify these steps a lot. There are some complexities involved for our particular use case at work. But I think this is enough for anyone wishing to get started.
