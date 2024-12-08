import { createContext } from "react";
import { Store } from "./createStore";

export type StoreContext<T extends (...args: any) => Store<any, any>> =
  React.Context<ReturnType<T> | null> & {
    /** Returns a new instance of the store. */
    instantiate: T;
  };

/**
 * Creates a store context with the given store instantiation function.
 *
 * @param instantiate - The function used to instantiate the store.
 * @returns A store context object with the given instantiation function.
 */
export const createStoreContext = <T extends (...args: any) => Store<any, any>>(
  instantiate: T,
): StoreContext<T> => {
  const context = createContext<ReturnType<T> | null>(null);
  return Object.assign(context, { instantiate });
};
