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
}));
```

3. Use the store:

```tsx
import { useStore } from "fransek-store";

function Counter() {
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <div>{count}</div>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## Creating a context store

Useful when you need to initialize the state asynchronously or using props.

```ts
import {
  createStore,
  createStoreContext,
  useStore,
  useStoreContext,
} from "fransek-store";
import { useMemo } from "react";

// Create the store context
const CounterStoreContext = createStoreContext(
  (initialState: { count: number }) =>
    createStore(initialState, (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    })),
);

function Counter({ initialState }: { initialState: { count: number } }) {
  // Create an instance of the store. Make sure the store is not instantiated on every render.
  const store = useMemo(
    () => CounterStoreContext.instantiate(initialState),
    [initialState],
  );
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    // Provide the store to the context
    <CounterStoreContext.Provider value={store}>
      <button onClick={decrement}>-</button>
      <div>{count}</div>
      <button onClick={increment}>+</button>
      <ChildComponent />
    </CounterStoreContext.Provider>
  );
}

const ChildComponent = () => {
  // Access the store from the context
  const {
    state: { count },
  } = useStoreContext(CounterStoreContext);

  return <div>Count: {count}</div>;
};
```

## Actions are optional

You can use the `set` function to update the state directly.

```tsx
import { createStore, useStore } from "fransek-store";

const store = createStore({ count: 0 });

function Counter() {
  const {
    state: { count },
    set,
  } = useStore(store);

  return (
    <div>
      <button onClick={() => set(({ count }) => ({ count: count + 1 }))}>
        -
      </button>
      <div>{count}</div>
      <button onClick={() => set(({ count }) => ({ count: count - 1 }))}>
        +
      </button>
    </div>
  );
}
```
