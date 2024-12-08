import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex">
      <div className="p-2 flex flex-col gap-2 text-lg border-r-[1px] min-h-screen p-4">
        <Link
          to="/"
          className="font-bold"
          activeProps={{
            className: "text-blue-500",
          }}
          activeOptions={{ exact: true }}
        >
          <h1>Demo</h1>
        </Link>
        <Link
          to="/counter"
          activeProps={{
            className: "text-blue-500",
          }}
        >
          Counter
        </Link>
        <Link
          to="/context"
          activeProps={{
            className: "text-blue-500",
          }}
        >
          Counter with Context
        </Link>
        <Link
          to="/todo"
          activeProps={{
            className: "text-blue-500",
          }}
        >
          Todo app
        </Link>
      </div>
      <main className="p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
