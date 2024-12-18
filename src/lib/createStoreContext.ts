import { Context, createContext } from "react";
import { Store } from "./createStore";

export type StoreContext<
  TArgs extends unknown[],
  TState extends object,
  TActions extends object,
> = Context<Store<TState, TActions> | null> & {
  /** Returns a new instance of the store. */
  instantiate: (...args: TArgs) => Store<TState, TActions>;
};

/**
 * Creates a store context with an instantiation function.
 * Useful if you need to initialize the store with dynamic data like props.
 *
 * @param instantiate - A function that returns a new store instance.
 * @returns A store context object with the given instantiation function.
 *
 * @example
 * import { createStore, createStoreContext } from "statekit";
 * import { useMemo } from "react";
 *
 * const StoreContext = createStoreContext((initialCount: number) =>
 *   createStore({ count: initialCount }, (set) => ({
 *     increment: () => set((state) => ({ count: state.count + 1 })),
 *     decrement: () => set((state) => ({ count: state.count - 1 })),
 *     reset: () => set({ count: 0 }),
 *   })),
 * );
 *
 * function StoreProvider({
 *   children,
 *   initialCount,
 * }: {
 *   children: React.ReactNode;
 *   initialCount: number;
 * }) {
 *   const store = useMemo(
 *     () => StoreContext.instantiate(initialCount),
 *     [initialCount],
 *   );
 *
 *   return (
 *     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
 *   );
 * }
 */
export const createStoreContext = <
  TArgs extends unknown[],
  TState extends object,
  TActions extends object,
>(
  instantiate: (...args: TArgs) => Store<TState, TActions>,
): StoreContext<TArgs, TState, TActions> => {
  const context = createContext<Store<TState, TActions> | null>(null);
  return Object.assign(context, { instantiate });
};
