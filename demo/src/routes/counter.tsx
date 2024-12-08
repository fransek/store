import { createFileRoute } from "@tanstack/react-router";
import { createStore, useStore } from "fransek-store";

export const Route = createFileRoute("/counter")({
  component: Counter,
});

// Create the store
const store = createStore({ count: 0 }, (set) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    <div className="flex gap-4 items-center">
      <button onClick={decrement}>-</button>
      <div>{count}</div>
      <button onClick={increment}>+</button>
    </div>
  );
}
