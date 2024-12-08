import { Context, useContext } from "react";
import { Store } from "./createStore";
import { useStore } from "./useStore";

/**
 * Custom hook to access the store context.
 *
 * @param {Context<Store<TState, TActions> | null>} storeContext - The context of the store.
 * @returns {Store<TState, TActions>} The store instance.
 */
export const useStoreContext = <TState extends object, TActions extends object>(
  storeContext: Context<Store<TState, TActions> | null>,
) => {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error(
      "Store context not found. Make sure you are using the store context within a provider.",
    );
  }
  return useStore(store);
};
