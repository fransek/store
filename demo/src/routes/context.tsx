import { createFileRoute } from "@tanstack/react-router";
import { createStore, useStore, useStoreContext } from "fransek-store";
import { createContext, useMemo } from "react";

export const Route = createFileRoute("/context")({
  component: Counter,
});

function Counter() {
  const store = useMemo(() => createCounterStore({ count: 0 }), []);
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    <CounterStoreContext.Provider value={store}>
      <div className="p-2">
        <h3 className="font-bold">Parent Component:</h3>
        <div className="flex gap-4 items-center">
          <button onClick={decrement}>-</button>
          <div>{count}</div>
          <button onClick={increment}>+</button>
        </div>
        <ChildComponent />
      </div>
    </CounterStoreContext.Provider>
  );
}

interface CounterState {
  count: number;
}

const createCounterStore = (initialState: CounterState) =>
  createStore(initialState, (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }));

const CounterStoreContext = createContext<ReturnType<
  typeof createCounterStore
> | null>(null);

const ChildComponent = () => {
  const {
    state: { count },
  } = useStoreContext(CounterStoreContext);

  return (
    <>
      <h3 className="font-bold">Child Component:</h3>
      <div className="flex gap-4 items-center">
        <div>Count: {count}</div>
      </div>
    </>
  );
};
