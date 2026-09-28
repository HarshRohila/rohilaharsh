---
name: oop
description: Plan and structure code in strict Object-Oriented style, treating TypeScript/JavaScript like Java or C# — everything lives inside classes, no loose top-level functions, consts, or object-literal "modules" even though the language allows it. Use when the user asks to plan, design, or refactor code in an OOP way, wants class-based architecture, or says "use oop", "plan this like Java", "no free functions".
disable-model-invocation: true
---

# OOP Planning

Force strict OOP design even in languages (TS/JS/Python) that permit non-OOP escape hatches. Goal: code reads like Java — every behavior and piece of state belongs to a class.

## Hard Rules (never violate)

1. **No top-level exported functions.** Every function is a method on a class (instance or `static`).
2. **No top-level mutable/derived state.** Module-scope `let`/`const` holding logic-relevant data is forbidden — wrap in a class field.
3. **No plain object literals used as a "service" or "namespace"** (e.g. `export const UserUtils = { doX, doY }`). Convert to a class with methods.
4. **No bag-of-functions files** (`utils.ts`, `helpers.ts` full of unrelated exports). Split by responsibility into named classes (`UserFormatter`, `DateRangeValidator`, etc.) — Single Responsibility.
5. **Every class gets an explicit access modifier** on members (`public`/`private`/`protected`). Never rely on implicit public.
6. **Behavior + data that change together live in the same class.** If a function only reads/writes one class's fields, it's a method of that class, not a free function taking that object as a param.
7. **Depend on abstractions, not concretions.** Define an `interface`/`abstract class` when a collaborator could have >1 implementation or when writing a test double. Inject dependencies via constructor.
8. **Prefer composition over inheritance**, but use inheritance for genuine "is-a" hierarchies with shared behavior (abstract base class + `protected` template methods).
9. **Constants that belong to a concept live as `static readonly` fields on that concept's class**, not scattered module-level `const`.
10. **Entry points are the only allowed non-class code** — e.g. `main.ts`, a CLI bootstrap, or a framework-mandated file (React component function, Express route registration). Everything they call must be a class method.
11. **No direct imports of frameworks/libraries inside domain/business classes.** Every 3rd-party or framework dependency (HTTP client, ORM, React, Express, date lib, logger, SDK) is wrapped by a project-owned `interface` (a "port"). Domain classes depend only on the port, injected via constructor.
12. **One adapter class per library, isolated to the edges.** The concrete library call lives only inside a small `XxxAdapter`/`XxxGateway` class implementing the port (e.g. `AxiosHttpClient implements HttpClient`, `PrismaOrderRepository implements OrderRepository`). If the library were uninstalled, only adapter classes fail to compile — every domain class and its tests still run using a hand-written fake/stub implementing the same port.
13. **Minimize the public surface.** Default every member to `private`. Promote to `public` only what the outside world (tests, other classes, the interface a port declares) must call. Multi-step internal logic stays as `private` helper methods, never inlined into one giant public method and never exposed just for convenience.
14. **Class name = noun, method name = verb (+ object), and the pair must read as a sentence.** `InvoiceCalculator.calculateTotal()`, `OrderValidator.validate()`, `PriceFormatter.format()`. Reject vague verbs (`handle`, `process`, `doStuff`, `manage`) and reject names requiring the method body to understand what it does.

## Framework/Library Isolation (Ports & Adapters)

Treat every external dependency as swappable infrastructure, never a hard dependency of business logic:

- **Define the port where the domain needs it**, not where the library lives: `interface Logger { info(msg: string): void }`, `interface Clock { now(): Date }`, `interface HttpClient { get<T>(url: string): Promise<T> }`.
- **Adapter classes translate library API → port**, e.g.:

```
class AxiosHttpClient implements HttpClient {
  constructor(private axios: AxiosInstance) {}
  async get<T>(url: string): Promise<T> { return (await this.axios.get<T>(url)).data }
}
```

- **Domain/service classes only ever import the port**, never `axios`, `prisma`, `dayjs`, React, etc. directly:

```
class OrderService {
  constructor(private http: HttpClient, private clock: Clock) {}
  // no import of axios/dayjs here — testable with fakes, library absent entirely
}
```

- **Tests instantiate domain classes with a hand-rolled fake implementing the port** (e.g. `class FakeHttpClient implements HttpClient`) — no mocking library, no real library installed, no framework runtime needed.
- **Framework-mandated files (React components, Express routes, CLI entry) are adapters too** — they construct the port implementations and inject them into domain classes; they contain no business logic themselves.
- When planning (see workflow below), explicitly list each external library touched and its port name before writing implementation code.

## Encapsulation & Naming

- **Start every method `private`; only widen to `public` with a reason** — called from outside the class, or required by an implemented `interface`. When reviewing a plan/diff, challenge each `public` method: "does anything outside this class actually call this?" If not, narrow it.
- **A class's public API should be small enough to summarize in one sentence** ("An `OrderValidator` validates orders"). Everything else supporting that is `private`.
- **Naming test**: read `ClassName.methodName()` aloud. It must form `<Noun> <verb>s <object>` and unambiguously state the effect, with no need to open the method body. `UserRepository.findById()`, not `UserRepository.get()`. `EmailSender.send()`, not `EmailSender.doSend()`/`EmailSender.run()`.
- Boolean methods read as predicates: `isValid()`, `hasPermission()`, `canRetry()` — not `checkValid()`/`validFlag()`.
- Private helper methods still follow the same verb-first naming, since they document the class's internal steps for future readers.

## Planning Workflow

When asked to plan a feature/module in OOP:

1. **Extract nouns** from the requirements → candidate classes.
2. **Extract verbs** → candidate methods, assign each to the class owning the data it touches.
3. For each class, define: constructor (dependencies + initial state), the minimal public method signatures it must expose, private helper methods for everything else, and which interface(s) it implements. Name every method per the Naming test below before moving on.
4. Draw class relationships: composition (`has-a`, constructor-injected) vs inheritance (`is-a`, `extends`).
5. Identify cross-cutting concerns (logging, validation, formatting) → each becomes its own single-purpose class, injected where needed — never a shared utils file.
6. List every external library/framework the feature touches → define a port interface for each and name its adapter class (see Framework/Library Isolation below). Domain classes reference only the port.
7. Present the plan as a class diagram list:

```
class OrderValidator implements Validator<Order> {
  + validate(order: Order): ValidationResult
  - checkLineItems(items: LineItem[]): boolean
}

class OrderService {
  constructor(private validator: Validator<Order>, private repo: OrderRepository)
  + placeOrder(order: Order): Promise<OrderId>
  - assertInStock(order: Order): void
}
```

8. Only after the class plan is confirmed, write implementation code following it exactly — no shortcuts back into free functions or direct library imports in domain classes.

## Refactoring Existing Code

When converting existing non-OOP TS/JS code:

- `export function foo(x) {...}` used elsewhere → move into the class that owns `x`'s type as a method, or into a new single-purpose class if it's a pure transform (e.g. `class PriceFormatter { static format(cents: number): string }`).
- `export const config = {...}` → `class AppConfig { static readonly X = ...; private constructor() {} }` (private constructor blocks instantiation, mimics a Java `final` utility/config class).
- React/Vue functional idioms and framework hooks are the one accepted exception (framework requires functions) — but all non-framework logic called from them must be delegated to classes.
- Flag every remaining top-level `function`/logic-bearing `const` in the file as a violation and propose its target class before finishing.

## Anti-Patterns to Reject

- "It's just a small helper, doesn't need a class" — reject; wrap it.
- Object literal with methods instead of a real `class` (loses `private`, `static`, inheritance, `instanceof`).
- Passing 5+ primitive params instead of a constructed value object class.
- `any`/untyped duck-typing instead of an explicit `interface`.
- Importing a library (`axios`, `dayjs`, ORM client, framework hook/HOC) directly inside a domain/service class instead of through a port + adapter.
- Mocking a library in tests instead of injecting a fake port implementation — signals the port boundary is missing.
- Marking a method `public` "just in case" or for test convenience without an actual external caller.
- Vague/generic method names (`handle`, `process`, `doWork`, `execute`) that force a reader to open the body to learn intent.
