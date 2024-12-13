import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const activeProps = {
    className: "text-blue-500",
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-2 text-lg border-r min-h-screen p-4">
        <Link
          to="/"
          className="font-bold"
          activeProps={activeProps}
          activeOptions={{ exact: true }}
        >
          <h1>Demo</h1>
        </Link>
        <Link to="/counter" activeProps={activeProps}>
          Counter
        </Link>
        <Link to="/context" activeProps={activeProps}>
          Counter with context
        </Link>
        <Link to="/todo" activeProps={activeProps}>
          Todo app
        </Link>
        <Link to="/async" activeProps={activeProps}>
          Async
        </Link>
        <Link to="/persistent" activeProps={activeProps}>
          Counter with persistent state
        </Link>
      </div>
      <main className="p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
