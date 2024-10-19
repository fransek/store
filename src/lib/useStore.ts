import { useSyncExternalStore } from "react";
import { Store } from "./createStore";

export const useStore = <TState extends object, TActions extends object>({
    get,
    set,
    reset,
    subscribe,
    actions,
}: Store<TState, TActions>) => {
    const state = useSyncExternalStore(subscribe, get, get);
    return { state, actions, set, reset };
};
