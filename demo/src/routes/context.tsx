import { createFileRoute } from "@tanstack/react-router";
import {
  createStore,
  createStoreContext,
  useStore,
  useStoreContext,
} from "fransek-store";
import { useMemo } from "react";

export const Route = createFileRoute("/context")({
  component: Counter,
});

// Create the store context
const CounterStoreContext = createStoreContext(
  (initialState: { count: number }) =>
    createStore(initialState, (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    })),
);

function Counter() {
  // Create an instance of the store. Make sure the store is not instantiated on every render.
  const store = useMemo(
    () => CounterStoreContext.instantiate({ count: 0 }),
    [],
  );
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    // Provide the store to the context
    <CounterStoreContext.Provider value={store}>
      <h3 className="font-bold">Parent Component</h3>
      <div className="flex gap-4 items-center mb-4">
        <button onClick={decrement}>-</button>
        <div>{count}</div>
        <button onClick={increment}>+</button>
      </div>
      <ChildComponent />
    </CounterStoreContext.Provider>
  );
}

const ChildComponent = () => {
  // Access the store from the context
  const {
    state: { count },
  } = useStoreContext(CounterStoreContext);

  return (
    <div>
      <h3 className="font-bold">Child Component</h3>
      <div className="flex gap-4 items-center">
        <div>Count: {count}</div>
      </div>
    </div>
  );
};
