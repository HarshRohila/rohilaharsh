---
name: react-tdd
description: >-
  TDD for React: logic in testable classes (Controller/Utils), external store
  state, useSyncExternalStore wiring, no mocks, cmd return types (never null),
  exhaustive matchCommand handlers, failing tests reviewed before implementation,
  one class per red-review-green loop.
  Agent runs class tests with bun test. Test files stay portable (no bun:test
  imports or Bun-only APIs) so the app Jest/Vitest suite still passes.
  Test only classes wired from React (components or hooks); skip dedicated
  tests for classes consumed only by other classes — cover those via the
  consumer. Use when writing React unit tests, TDD, controllers, class-based
  logic, useSyncExternalStore, LoadCommand, matchCommand, bun test, or
  fearless refactoring tests.
disable-model-invocation: true
---

# React TDD

Any React project. Logic lives in classes. Tests hit public methods. React only renders DOM and wires the class.

## Hard rules

- Fast unit tests. High confidence. Tests independent of any framework and library.
- Agent runs Controller/Utils tests with `bun test path/to/TheClass.test.ts` (install `bun` if missing; do not switch runner for the TDD loop). Test **source** must also pass the app’s existing runner (Jest, Vitest, etc.). Intersection only: globals `describe` / `it` / `expect` — no test-runner imports.
- Never add Bun-specific APIs, imports, config, or types to make `bun test` pass (`bun:test`, `import { … } from 'bun:test'`, Bun-only matchers, `bunfig.toml` / preload just for these files). That breaks the app suite.
- If implementation uses a library internally, do not mock it.
- No mocks of any kind.
- Tests create a class instance and exercise public methods.
- Add tests only for classes consumed in React (component or hook). Do not add a test file for a class consumed only by another class — cover it by testing the consumer. Tests are React-independent; only React-consumed classes need their own tests.
- Keep public methods as few as possible.
- No side effects in these classes (no API calls). Prepare the call; consume a `Result`. Never invoke services/HTTP inside the class.
- Always use classes instead of standalone functions (so tests can construct an instance). Exception: copy `matchCommand` as a shared util function — not a class.
- Class does not render DOM. Class owns all logic. React components own DOM and wiring only.
- All public class methods are arrow-function properties (`readonly handleSubmit = (): Cmd => { … }`), not prototype methods. React passes them detached (`onClick={controller.handleSubmit}`, `useSyncExternalStore(controller.subscribe, controller.getState)`), and a prototype method loses `this`. Private helpers may stay prototype methods; if written as arrow properties, mark them `private readonly`.
- Every arrow-function property is `readonly` (`readonly getState = …`, `private readonly describeStatusChange = …`). They are never reassigned; SonarQube `typescript:S2933` flags them otherwise.
- Tests are documentation. Prefer readable names and examples over clever helpers.
- Tests comment `// Arrange`, `// Act`, `// Assert` for each step.
- Never return `null` (or `undefined`) from class methods. If there is nothing to do, return a cmd (`{ type: 'skip' }` or domain-equivalent). Use a discriminated cmd union as the return type when the UI must decide whether to run a side effect.
- Handle cmds exhaustively with `matchCommand` and a `Record<Cmd['type'], Handler>` map. No `if (command.type === …)`. Missing cmd type must be a TypeScript error.

## TDD gate (mandatory)

**One class per loop.** When a feature needs several classes, do not write tests for all of them up front. Pick one class, run the full loop below to green, then start the next class. Order: consumer-facing class first (the one React wires), then classes it depends on only if they turn out to need their own tests (see [Tests](#tests)).

For **each** class, in order:

1. Write **failing** tests for this class only. Confirm red with `bun test path/to/TheClass.test.ts`.
2. **Stop. Get them reviewed by the user.** Do not write implementation yet. Do not write tests for the next class yet.
3. After user approves, write the minimum class/implementation to pass. Confirm green with the same `bun test` command.
4. Refactor implementation without changing tests when possible. Re-run `bun test` on that file.
5. Only now move to the next class and restart at step 1.

Never skip step 2. Never batch test files for multiple classes into one review.

## Naming and scope

Always create a class whose name is linked to business needs, so that refactoring doesn't mean I need to modify tests. Idea is fearless refactoring without changing tests.

Classes consumed by `useSyncExternalStore` end with `Controller`.

Example: component `OrderLineItemsTable` is a business thing. If it is a UI component, its class can be `OrderLineItemsTableController`.

Doesn't mean each component will have a controller class. Child components can use the controller by passing the controller as a prop.

If a child is complex, managing its own state, and also representing a business entity, create a separate controller class for it too. Give that class its own tests only if React (a component or hook) consumes it. If only another class consumes it, skip its test file and cover behavior through the consumer’s tests.

If the React component is not representing anything in UI, use `Utils` in the class name instead of `Controller`. `Controller` is for components which are rendering DOM. Non-DOM should use `Utils`.

| Kind | Suffix | When |
|------|--------|------|
| DOM-backed business UI | `Controller` | Wired with `useSyncExternalStore` |
| Non-DOM logic | `Utils` | No render surface |

One class per business entity, not per file/component. Split only when a child is its own business entity with its own state that parent tests cannot cover.

## State

Keep state outside React. Expose `subscribe` + `getState`. React uses `useSyncExternalStore`.

**Do not add RxJS only for this.** If the app already has RxJS, `BehaviorSubject` is fine. If not, use a listener set. Public API stays the same so tests do not care.

Only `patchState` notifies subscribers. Other methods pass a partial and call `patchState`.

RxJS (only if already in the app):

```ts
class OrderLineItemsTableController {
  private readonly state$ = new BehaviorSubject<State>(initialState);

  readonly subscribe = (onStoreChange: () => void): (() => void) => {
    const sub = this.state$.subscribe(onStoreChange);
    return () => sub.unsubscribe();
  };

  readonly getState = (): State => this.state$.getValue();

  private patchState(partial: Partial<State>): void {
    this.state$.next({ ...this.getState(), ...partial });
  }
}
```

No RxJS:

```ts
class OrderLineItemsTableController {
  private state: State = initialState;
  private readonly listeners = new Set<() => void>();

  readonly subscribe = (onStoreChange: () => void): (() => void) => {
    this.listeners.add(onStoreChange);
    return () => {
      this.listeners.delete(onStoreChange);
    };
  };

  readonly getState = (): State => this.state;

  private patchState(partial: Partial<State>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }
}
```

`subscribe` and `getState` are `readonly` arrow properties on purpose: React calls them detached, and they are never reassigned. Same rule for every public method (see [Hard rules](#hard-rules)).

React: lazy-create the instance with `useState` (stable for the component lifetime). Pass `controller` to children. Do not pass a third `getServerSnapshot` to `useSyncExternalStore` unless the app uses SSR / React Server Components.

```tsx
const [controller] = React.useState(
  () => new OrderLineItemsTableController(),
);
const state = useSyncExternalStore(
  controller.subscribe,
  controller.getState,
);
```

Wiring + children: [examples.md](examples.md).

## Commands (no null returns)

A **cmd** is an instruction *out* of the class, *into* UI wiring. Discriminated on `type`. Example:

```ts
type LoadCommand =
  | { type: 'skip' }
  | { type: 'fetch'; queryParams: QueryParams; append: boolean };
```

- `skip` = do not run the effect. Not `null`.
- Other variants carry everything the UI needs to run the effect (service args, query params).
- Name the union for the job (`LoadCommand`, `SubmitCommand`), not a generic `Action`.
- State fields may still be `string | null`. Method **return types** may not.

UI runs cmds with `matchCommand` so every `type` has a handler. Copy [matchCommand.ts](matchCommand.ts) into the project (typically `src/utils/matchCommand.ts`) if it is missing. Do not reimplement with `if`/`switch`. `matchCommand` is a shared type util, not business logic — do not wrap it in a Controller/Utils class.

```ts
matchCommand(command, {
  fetch: ({ queryParams }) => {
    void execute(fetchOptions, queryParams);
  },
  skip: () => {},
});
```

## Side effects (API / services)

Controller never runs the effect. UI (or existing Service layer) does.

1. Action method named for the UI action (submit button → `handleSubmit`). Returns a **cmd** (or the service args wrapped in a cmd) — never `null`.
2. If the repo already uses services, cmd payload matches that service method — not a parallel HTTP client.
3. Effect returns a rust-like `Result<SuccessResponse, FailResponse>`.
4. Controller has a result method (`handleSubmitResult`) that takes that `Result` and updates state. Tests call it directly. No mocks.

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

class OrderFormController {
  readonly handleSubmit = (): CreateOrderServiceArgs => {
    return { lineItems: this.getState().lineItems };
  };

  readonly handleSubmitResult = (
    result: Result<CreateOrderSuccess, CreateOrderFailure>,
  ): void => {
    if (result.ok) {
      this.patchState({
        submittedOrderId: result.value.orderId,
        submitError: null,
      });
      return;
    }
    this.patchState({
      submittedOrderId: null,
      submitError: this.describeFailure(result.error),
    });
  };

  private readonly describeFailure = (error: CreateOrderFailure): string =>
    error.message;
}
```

UI wiring (not in unit tests):

```ts
const args = controller.handleSubmit();
const result = await toResult(ordersService.create(args));
controller.handleSubmitResult(result);
```

Full example: [examples.md](examples.md).

## Tests

Add a `*.test.ts` only when the class is consumed from React — a component or a hook constructs it or calls its methods. Tests stay React-independent (class instance + public methods). That is why inner classes do not get their own tests: React never sees them; the consumer class is the boundary.

Do **not** add tests for a class if another class is its only consumer. Put the cases on the consumer. Example: `LineQtyUtils` used only by `OrderLineItemsTableController` → test `OrderLineItemsTableController` only.

A class used by both React and another class still gets tests — React consumes it.

File next to class: `OrderLineItemsTableController.test.ts` (not `.tsx` — no DOM).

Agent command (TDD loop):

```bash
bun test src/path/OrderLineItemsTableController.test.ts
```

Same file must still pass when the app’s Jest/Vitest (or equivalent) picks it up. Portable subset only:

- Globals: `describe`, `it`, `expect` (`toEqual`, `toBe`, `toThrow`, …). No `import` from `bun:test`, `vitest`, `@jest/globals`, or `jest`.
- No Bun-only, Jest-only, or Vitest-only APIs (`jest.mock`, `jest.fn`, `vi.fn`, `vi.mock`, fake timers, Bun matchers).
- No extra runner config (`bunfig.toml`, Jest/Vitest setup) just to make class tests run.

```ts
it('adds a line item with quantity 1', () => {
  // Arrange
  const controller = new OrderLineItemsTableController();

  // Act
  controller.addLineItem({ sku: 'ABC' });

  // Assert
  expect(controller.getState().lineItems).toEqual([
    { sku: 'ABC', quantity: 1 },
  ]);
});
```

- Every test comments the steps: `// Arrange`, `// Act`, `// Assert`.
- Arrange: `new TheClass(...)`.
- Act: public method (`handleSubmit`, `handleSubmitResult`, …).
- Assert: public read (`getState` or other public getters).
- Names describe business behavior, not implementation.
- Side-effect tests: assert cmd return value (`skip` vs payload variants); call `handle*Result` with a constructed `Result`. Never mock services.
- Agent verifies with `bun test <file>`. Do not change app or Bun config so one runner works and the other breaks.

## Implementation after review

- Pass tests with smallest public API.
- Hide internals (`private`). Tests never reach private fields.
- Public methods as `readonly` arrow properties so `this` survives when React passes them as callbacks. Private arrow properties are `private readonly`.
- HTTP / services stay in UI wiring. Controller: cmd out, `Result` in. If `matchCommand` is missing, add it from this skill before wiring.

## Anti-patterns

- Installing RxJS only to hold controller state
- `useMemo(() => new Controller())` for the instance — use `React.useState(() => new Controller())`
- Third `useSyncExternalStore` argument when the app has no SSR / RSC
- `jest.mock` / `vi.mock` / `import { … } from 'bun:test'` / module mocks / fake timers to hide the store
- Bun-only test code or config so `bun test` passes but Jest/Vitest fails (or the reverse)
- Calling services or `fetch` inside Controller/Utils
- Testing React components for business rules
- Adding `FooUtils.test.ts` (or any class test) when `FooUtils` is only used by another class — test the consumer instead
- Standalone exported functions for logic that belongs on a class
- One Controller per tiny presentational child (pass parent controller as a prop)
- Public setters for every field
- Changing tests to match a refactor of internals
- Class method named `getSnapshot` — use `getState` (React API still takes that fn as the snapshot getter)
- Public prototype methods (`handleSubmit() { … }`) — `this` is lost when passed as `onClick={controller.handleSubmit}`; use arrow properties. Do not fix with `.bind(this)` in constructor or `() => controller.handleSubmit()` wrappers in JSX
- Arrow-function property without `readonly` (`handleSubmit = () => …`, `private describeStatusChange = () => …`) — SonarQube S2933 "never reassigned; mark it as `readonly`"
- Notifying subscribers from more than one method — only `patchState` may notify
- Returning `null` / `undefined` from a class method to mean “do nothing”
- `if` / `switch` on `command.type` instead of `matchCommand`
- Inventing a project-local matcher when [matchCommand.ts](matchCommand.ts) can be copied in
- Runner-specific matchers, globals, or config (Bun, Jest, or Vitest)
- Writing failing tests for several classes at once, then asking for one combined review — one class per red → review → green loop
