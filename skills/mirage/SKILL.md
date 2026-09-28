---
name: mirage
description: >-
  Enforces MirageJS factory types, strict typing, and relationship modeling
  when editing mirage mock-server logic. Use when creating or editing mirage
  factories, models, serializers, route handlers, seed data, or tests that
  create mirage records, or when the user mentions mirage, miragejs,
  Factory.extend, Model.extend, belongsTo, or hasMany.
---

# Mirage

Apply when editing mirage logic: factories, models, serializers, route handlers, seed data, and tests that create mirage records.

## Rules

- always keep the type of mirage factory same as what is used in app, never use different types
- use strict typing in mirage logic, never use casting to bypass, fix logic to not need type casting
- mirage way is using relationships for related data, never create workarounds like adding extra fields to maintain custom relationships, use mirage way of relationships

## Apply

1. Find the TypeScript type the app already uses for that record (API response type, service model, UI type). Factory attrs and records created from that factory use that same type. Do not add a parallel mock-only type.
2. Type `schema`, `server`, and factory attrs from the project's mirage `Registry<Models, Factories>` type. No `as any`, `as unknown as`, `@ts-expect-error`, or `@ts-ignore` to silence a type error. Change the model, factory, or call so the types line up.
3. Related records: declare `belongsTo` or `hasMany` on the model via `Model.extend`. Pass the related model into `server.create` or `createList`. Do not add extra id fields or nested objects on the factory to fake a relationship.
