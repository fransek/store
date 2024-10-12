import { useSyncExternalStore } from "react";

export type Store<TState extends object, TActions extends object> = {
    getState: () => TState;
    subscribe: (listener: () => void) => () => void;
    actions: TActions;
};

export type Setter<TState extends object> =
    | Partial<TState>
    | ((state: TState) => Partial<TState>);

export const createStore = <TState extends object, TActions extends object>(
    initialState: TState,
    generateActions: (
        set: (setter: Setter<TState>) => TState,
        get: () => TState,
    ) => TActions,
): Store<TState, TActions> => {
    let state = initialState;
    let listeners: (() => void)[] = [];

    const setState = (setter: Setter<TState>) => {
        const newState = typeof setter === "function" ? setter(state) : setter;
        state = { ...state, ...newState };
        listeners.forEach((listener) => listener());
        return state;
    };

    const getState = () => state;

    const subscribe = (listener: () => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };

    const actions = generateActions(setState, getState);

    return { getState, subscribe, actions };
};

export const useStore = <TState extends object, TActions extends object>({
    actions,
    getState,
    subscribe,
}: Store<TState, TActions>) => {
    const state = useSyncExternalStore(subscribe, getState, getState);
    return { state, actions };
};
