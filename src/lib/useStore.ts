import { useSyncExternalStore } from "react";
import { StateModifier, Store } from "./createStore";

export type BoundStore<TState extends object, TActions extends object> = {
  state: TState;
  actions: TActions;
  set: (stateModifier: StateModifier<TState>) => TState;
};

/**
 * Custom hook to bind a store to a component.
 *
 * @param {Store<TState, TActions>} store - The store created with `createStore`.
 * @returns {BoundStore<TState, TActions>} An object containing the current state, actions, and set function.
 *
 * @example
 * import { useStore } from "fransek-store";
 * import { store } from "./store";
 *
 * function Counter() {
 *   const {
 *     state: { count },
 *     actions: { increment, decrement, reset },
 *   } = useStore(store);
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
export const useStore = <TState extends object, TActions extends object>({
  get,
  set,
  subscribe,
  actions,
}: Store<TState, TActions>): BoundStore<TState, TActions> => {
  const state = useSyncExternalStore(subscribe, get, get);
  return { state, actions, set };
};
