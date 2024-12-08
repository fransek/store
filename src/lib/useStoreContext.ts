import { Context, useContext } from "react";
import { Store } from "./createStore";
import { useStore } from "./useStore";

export const useStoreContext = <TState extends object, TActions extends object>(
  storeContext: Context<Store<TState, TActions> | null>,
) => {
  const store = useContext(storeContext);
  if (!store) {
    throw new Error(
      "Store context not found. Make sure you are using the StoreProvider.",
    );
  }
  return useStore(store);
};
