# React TDD examples

## Controller + React wiring + child props

Prefer `React.useState(() => new …)` so the instance is created once. Two `useSyncExternalStore` args only (no `getServerSnapshot`) unless the app uses SSR / RSC.

If RxJS is already a dependency, `BehaviorSubject` is fine. If not, use the listener-set store — do not add RxJS for this.

```tsx
import React, { useSyncExternalStore } from 'react';

type LineItem = { sku: string; quantity: number };

type State = {
  lineItems: LineItem[];
};

const initialState: State = { lineItems: [] };

export class OrderLineItemsTableController {
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

  readonly addLineItem = (input: { sku: string }): void => {
    this.patchState({
      lineItems: [
        ...this.getState().lineItems,
        { sku: input.sku, quantity: 1 },
      ],
    });
  };
}

export function OrderLineItemsTable() {
  const [controller] = React.useState(
    () => new OrderLineItemsTableController(),
  );
  const { lineItems } = useSyncExternalStore(
    controller.subscribe,
    controller.getState,
  );

  return (
    <table>
      <tbody>
        {lineItems.map((item) => (
          <OrderLineItemRow
            key={item.sku}
            item={item}
            controller={controller}
          />
        ))}
      </tbody>
    </table>
  );
}

function OrderLineItemRow({
  item,
  controller,
}: {
  item: LineItem;
  controller: OrderLineItemsTableController;
}) {
  return (
    <tr>
      <td>{item.sku}</td>
      <td>{item.quantity}</td>
    </tr>
  );
}
```

Pass the same controller instance as a prop. Do not create a second Controller unless the child is its own business entity.

## Commands: skip instead of null

Controller returns a cmd. UI uses `matchCommand`. If the repo has no matcher, copy [matchCommand.ts](matchCommand.ts) to `src/utils/matchCommand.ts`.

```ts
type QueryParams = { page: number; per_page: number };

type LoadCommand =
  | { type: 'skip' }
  | { type: 'fetch'; queryParams: QueryParams; append: boolean };

export class UserFilterController {
  private hasLoaded = false;

  readonly handleOpenChange = (isOpen: boolean): LoadCommand => {
    if (!isOpen || this.hasLoaded) {
      return { type: 'skip' };
    }

    return {
      type: 'fetch',
      queryParams: { page: 1, per_page: 50 },
      append: false,
    };
  };
}
```

```ts
it('skips fetch when the filter is closed', () => {
  // Arrange
  const controller = new UserFilterController();

  // Act
  const command = controller.handleOpenChange(false);

  // Assert
  expect(command).toEqual({ type: 'skip' });
});
```

```tsx
const loadOptions = (command: LoadCommand) =>
  matchCommand(command, {
    fetch: ({ queryParams }) => {
      void execute(fetchUsers, queryParams);
    },
    skip: () => {},
  });
```

Do not `if (command.type === 'fetch')`. Add a new `LoadCommand` variant → TS error until the map handles it.

## Side effects: cmd + Result

```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CreateOrderServiceArgs = { lineItems: LineItem[] };
type CreateOrderSuccess = { orderId: string };
type CreateOrderFailure = { message: string };

type State = {
  lineItems: LineItem[];
  submittedOrderId: string | null;
  submitError: string | null;
};

export class OrderFormController {
  private state: State = {
    lineItems: [],
    submittedOrderId: null,
    submitError: null,
  };
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

  readonly addLineItem = (input: { sku: string }): void => {
    this.patchState({
      lineItems: [
        ...this.getState().lineItems,
        { sku: input.sku, quantity: 1 },
      ],
    });
  };

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

UI (not unit-tested here) uses existing services:

```ts
const args = controller.handleSubmit();
const result = await toResult(ordersService.create(args));
controller.handleSubmitResult(result);
```

`toResult` maps service success/throw/error-body into `Result`. Keep it at the boundary, not in the controller.

## Tests as documentation

```ts
describe('OrderLineItemsTableController', () => {
  it('starts with no line items', () => {
    // Arrange
    const controller = new OrderLineItemsTableController();

    // Act
    const state = controller.getState();

    // Assert
    expect(state.lineItems).toEqual([]);
  });

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
});

describe('OrderFormController handleSubmit', () => {
  it('returns service args from current line items', () => {
    // Arrange
    const controller = new OrderFormController();
    controller.addLineItem({ sku: 'ABC' });

    // Act
    const args = controller.handleSubmit();

    // Assert
    expect(args).toEqual({
      lineItems: [{ sku: 'ABC', quantity: 1 }],
    });
  });

  it('stores order id when submit succeeds', () => {
    // Arrange
    const controller = new OrderFormController();

    // Act
    controller.handleSubmitResult({
      ok: true,
      value: { orderId: 'ord-1' },
    });

    // Assert
    expect(controller.getState().submittedOrderId).toBe('ord-1');
    expect(controller.getState().submitError).toBeNull();
  });

  it('stores error when submit fails', () => {
    // Arrange
    const controller = new OrderFormController();

    // Act
    controller.handleSubmitResult({
      ok: false,
      error: { message: 'network' },
    });

    // Assert
    expect(controller.getState().submitError).toBe('network');
  });
});
```

## Utils (non-DOM)

```ts
export class MoneyUtils {
  private readonly amountCents: number;

  constructor(amountCents: number) {
    this.amountCents = amountCents;
  }

  readonly add = (other: MoneyUtils): MoneyUtils => {
    return new MoneyUtils(this.amountCents + other.amountCents);
  };

  readonly toCents = (): number => {
    return this.amountCents;
  };
}
```

```ts
it('adds two amounts', () => {
  // Arrange
  const left = new MoneyUtils(100);
  const right = new MoneyUtils(50);

  // Act
  const total = left.add(right);

  // Assert
  expect(total.toCents()).toBe(150);
});
```
