import { createFileRoute, Link } from "@tanstack/react-router";
import { createPersistentStore, useStore } from "@fransek/statekit";

export const Route = createFileRoute("/persistent")({
  component: RouteComponent,
});

// Create the store
const store = createPersistentStore(
  // Provide a unique key to identify the store in storage
  "count",
  { count: 0 },
  (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }),
  {
    // storage: "session",
    // serializer: superjson,
  },
);

function RouteComponent() {
  // Use the store
  const {
    state: { count },
    actions: { increment, decrement },
  } = useStore(store);

  return (
    <div>
      <div className="flex gap-4 items-center">
        <button onClick={decrement}>-</button>
        <div aria-label="count">{count}</div>
        <button onClick={increment}>+</button>
      </div>
      <Link target="_blank" href="/persistent">
        Duplicate this tab
      </Link>
    </div>
  );
}
