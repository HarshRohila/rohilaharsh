---
title: 'How I Use AI at My Work'
date: 2026-03-08T10:00:00+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/ai_use_at_work.png'
---

AI tools have changed how many of us write code. Over the past few years, I've been integrating AI into my daily development workflow, and it has significantly changed how I approach building features, writing tests, and reviewing code.

I use **Cursor AI** — it's what my current organisation provides. In this post, I want to share how I use it day-to-day. This isn't meant to be a definitive guide or the "best" way to use AI. It's simply what works for me right now, and I'm still figuring things out. If you pick up something useful from this, that's great.

## Plan Mode: The Game Changer

Before Cursor introduced **Plan Mode**, I mostly used the Agent Mode. It worked, but there was a problem — it would generate large amounts of code across multiple files. Reviewing all those changes was difficult. I'd have to jump between files trying to understand what changed and why, which slowed things down.

After Plan Mode was introduced, I rarely write code without AI.

Here's why I like it: Plan Mode generates a **markdown file** that describes all the changes it intends to make. Instead of reviewing scattered code changes across multiple files, everything is laid out in a single place. It's easy to read and reason about.

My workflow looks like this:

1. I describe the feature or change I want.
2. Cursor generates a plan.
3. I review the plan and refine it — sometimes going back and forth a few times until I'm satisfied with the approach.
4. Once the plan looks good, I click **Build** to see the actual implementation.
5. I review the code changes that were made.

The key is the refinement loop. I keep iterating on the plan until it captures exactly what I want. Only then do I let it generate the code.

## Feature by Feature, Not Story by Story

A Jira story usually contains multiple features. Instead of trying to implement the entire story in one go, I break it down and use Plan Mode for **each feature individually**.

For each feature, I go through the plan-review-build cycle and create a **separate commit**. This way, each commit in the history reflects a single feature, making the git log much cleaner and easier to follow during reviews.

## Unit Tests: Where AI Still Struggles

This is an area where AI needs significant guidance. Out of the box, AI is pretty bad at writing unit tests. The biggest issue? **It mocks too many things.** Excessive mocking decreases confidence in the tests — if everything is mocked, you're not really testing much.

To tackle this, I created a **Cursor rule file** with specific testing guidelines:

- Don't mock things unless absolutely needed.
- Prefer rendering the entire React app page and testing that.
- Only mock service files (the ones making API calls).

This helped with the mocking problem, but AI still struggles with writing **readable tests**. The test code it produces can be hard to follow.

What works better for me is giving AI a **bigger prompt** that explains the business context — what the feature does and what scenarios I want to cover. Instead of saying "write tests for this component," I describe the business behaviour I expect. When the tests give me confidence that things are working correctly, only then do I test the actual feature in the browser.

If I notice a bug while testing in the browser, I go back to AI — I tell it to **write a test for that specific case first**, and then fix the bug. If there are multiple cases for some piece of logic, I guide AI to extract that logic into its own function and cover all the cases with tests.

## Refactoring with Confidence

After everything is working — features implemented, tests passing, browser testing done — I review all my changes to look for refactoring opportunities. This is the part I actually enjoy the most, because the tests are already in place. I know that if I break something during refactoring, the tests will catch it.

For refactoring too, I use Plan Mode. It's the same workflow: describe the refactoring, review the plan, build, and verify.

## Code Reviews: AI + Human

For my own feature branches, I use Cursor's **agent review feature with deep mode** to get an AI review before raising a PR. It helps catch things I might have missed.

For reviewing **other developers' pull requests**, I use a combination of agent review and manual review. The agent review does catch some issues, but honestly, it's still not great at everything. I find that **manual review catches more** — especially things like bad patterns being introduced, code that would be hard to extend later, or code that's hard to read. AI tends to miss those subtler design concerns.

## What I Haven't Explored Yet

I haven't tried Cursor's **"Agent Skills"** feature yet. It's on my list to explore and see if it can help streamline my workflow further.

## Looking Ahead

I'm genuinely excited about the future of AI in software development. It has already changed a lot in the last few years — the way we write code, test it, review it. And I think we're still early. I'm curious to see how these tools evolve and how our workflows will look a year or two from now.

---

_This is what works for me today, and it keeps evolving. If you've found AI workflows that work well for you, I'd love to hear about them in the comments!_
