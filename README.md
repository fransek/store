# Statekit

A tiny state management library for React.

## Getting started

1. Install the package:

```sh
npm i statekit
```

2. Create a store:

```ts
import { createStore } from "statekit";

const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

3. Use the store:

```tsx
import { useStore } from "statekit";
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
