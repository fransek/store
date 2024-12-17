# fransek-store

A tiny state management library for React.

## Getting started

1. Install the package:

```sh
npm i fransek-store
```

2. Create a store:

```ts
import { createStore } from "fransek-store";

const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

3. Use the store:

```tsx
import { useStore } from "fransek-store";
import { store } from "./store";

function Counter() {
  const {
    state: { count },
    actions: { increment, decrement, reset },
  } = useStore(store);

  return (
    <div>
      <div>{count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## API Reference

### `createStore`

```ts
const store = createStore(initialState, defineActions?, options?);
```

Creates a store with an initial state and actions.

#### Parameters

- `initialState` - The initial state of the store.
- `defineActions` - A function that defines the actions of the store.
- `options` - An object with the following options:
  - `onLoad` - Invoked when the store is created.
  - `onAttach` - Invoked when the store is subscribed to.
  - `onDetach` - Invoked when the store is unsubscribed from.
  - `onStateChange` - Invoked whenever the state changes.
  - `resetOnDetach` - Whether to reset the state to the initial state when the store is detached.

#### Returns

- An object with the following properties:
  - `get` - Returns the current state of the store.
  - `set` - Sets the state of the store.
  - `subscribe` - Subscribes to changes in the state of the store. Returns an unsubscribe function.
  - `actions` - Actions that can modify the state of the store.
  - `addEventListener` - Adds an event listener to the store.
  - `removeEventListener` - Removes an event listener from the store.

#### Example

```ts
import { createStore } from "fransek-store";

const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### `useStore`

```tsx
const { state, actions, set } = useStore(store);
```

A hook that binds a store to a component.

#### Parameters

- `store` - The store to bind.

#### Returns

- An object with the following properties:
  - `state` - The state of the store.
  - `actions` - The actions of the store.
  - `set` - A function that sets the state of the store.

#### Example

```tsx
import { useStore } from "fransek-store";
import { store } from "./store";

function Counter() {
  const {
    state: { count },
    actions: { increment, decrement, reset },
  } = useStore(store);

  return (
    <div>
      <div>{count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### `createStoreContext`

```ts
const StoreContext = createStoreContext(instantiate);
```

Creates a store context with an instantiation function. This is useful if you need to initialize the store with dynamic data like props.

#### Parameters

- `instantiate` - A function that creates a store instance.

#### Returns

- A react context with an additional `instantiate` method. This is the function provided in the parameters.

#### Example

```ts
import { createStore, createStoreContext } from "fransek-store";
import { useMemo } from "react";

const StoreContext = createStoreContext((initialCount: number) =>
  createStore({ count: initialCount }, (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  })),
);

function StoreProvider({
  children,
  initialCount,
}: {
  children: React.ReactNode;
  initialCount: number;
}) {
  const store = useMemo(
    () => StoreContext.instantiate(initialCount),
    [initialCount],
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
```

### `useStoreContext`

```tsx
const { state, actions, set } = useStoreContext(StoreContext);
```

A hook that binds a store context to a component.

#### Parameters

- `storeContext` - The store context to bind.

#### Returns

- An object with the following properties:
  - `state` - The state of the store.
  - `actions` - The actions of the store.
  - `set` - A function that sets the state of the store.

#### Example

```tsx
import { useStoreContext } from "fransek-store";
import { StoreContext } from "./store";

function Counter() {
  const {
    state: { count },
    actions: { increment, decrement, reset },
  } = useStoreContext(StoreContext);

  return (
    <div>
      <div>{count}</div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### `createPersitentStore`

```ts
const store = createPersistentStore(key, initialState, defineActions?, options?);
```

Creates a store that persists its state in `localStorage` or `sessionStorage`.

#### Parameters

- `key` - The key to use for storing the state in `localStorage` or `sessionStorage`.
- `initialState` - The initial state of the store.
- `defineActions` - A function that defines the actions of the store.
- `options` - This extends the options of `createStore` with the following additional options:
  - `storage` - The storage to use. Can be either `localStorage` or `sessionStorage`. Defaults to `localStorage`.
  - `serializer` - An object or class with `stringify` and `parse` methods. Defaults to `JSON`.

#### Returns

- The same as `createStore`.

#### Example

```ts
import { createPersistentStore } from "fransek-store";

const store = createPersistentStore("count", { count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

#### Note

The state needs to be serializable by whatever serializer you use. If you need something more versatile I would recommend a library like [superjson](https://github.com/flightcontrolhq/superjson).
