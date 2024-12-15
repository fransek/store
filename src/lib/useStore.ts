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
 *
 * @returns {BoundStore<TState, TActions>} An object containing the current state, actions, and set function.
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
