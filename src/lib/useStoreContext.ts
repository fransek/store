import { useContext } from "react";
import { StoreContext } from "./createStoreContext";
import { BoundStore, useStore } from "./useStore";

/**
 * Custom hook to access the store context.
 *
 * @param {StoreContext<TArgs, TState, TActions>} storeContext - The context of the store.
 * @returns {BoundStore<TState, TActions>} The store instance.
 */
export const useStoreContext = <
  TArgs extends unknown[],
  TState extends object,
  TActions extends object,
>(
  storeContext: StoreContext<TArgs, TState, TActions>,
): BoundStore<TState, TActions> => {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error(
      "Store context not found. Make sure you are using the store context within a provider.",
    );
  }
  return useStore(store);
};
