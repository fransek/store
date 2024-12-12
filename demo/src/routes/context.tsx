import { createFileRoute } from "@tanstack/react-router";
import {
  createStore,
  createStoreContext,
  useStore,
  useStoreContext,
} from "fransek-store";
import { useRef } from "react";

export const Route = createFileRoute("/context")({
  component: RouteComponent,
});

// Create the store context
const CounterStoreContext = createStoreContext(
  (initialState: { count: number }) =>
    createStore(
      initialState,
      (set) => ({
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }),
      { resetOnDetach: true },
    ),
);

function RouteComponent() {
  // Create an instance of the store. Make sure the store is not instantiated on every render.
  const store = useRef(CounterStoreContext.instantiate({ count: 0 })).current;
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
        <div aria-label="count">{count}</div>
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
        <div data-testid="child">Count: {count}</div>
      </div>
    </div>
  );
};
