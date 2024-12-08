import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-6 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Demo
        </Link>
        <Link
          to="/counter"
          activeProps={{
            className: "font-bold",
          }}
        >
          Counter
        </Link>
        <Link
          to="/context"
          activeProps={{
            className: "font-bold",
          }}
        >
          Counter with Context
        </Link>
      </div>
      <hr />
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
