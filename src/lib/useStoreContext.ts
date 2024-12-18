import { useContext } from "react";
import { StoreContext } from "./createStoreContext";
import { BoundStore, useStore } from "./useStore";

/**
 * A hook used to access a store context created with `createStoreContext`.
 *
 * @param {StoreContext<TArgs, TState, TActions>} storeContext - The context of the store.
 * @returns {BoundStore<TState, TActions>} The store instance.
 *
 * @example
 * import { useStoreContext } from "statekit";
 * import { StoreContext } from "./store";
 *
 * function Counter() {
 *   const {
 *     state: { count },
 *     actions: { increment, decrement, reset },
 *   } = useStoreContext(StoreContext);
 *
 *   return (
 *     <div>
 *       <div>{count}</div>
 *       <button onClick={decrement}>-</button>
 *       <button onClick={increment}>+</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
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
