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
 * Creates a store context with the given store instantiation function.
 *
 * @param instantiate - A function that returns a new store instance.
 * @returns A store context object with the given instantiation function.
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
