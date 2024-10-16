import { describe, expect, it, vi } from "vitest";
import { createStore } from "./createStore";

describe("createStore", () => {
    it("should initialize with the given state", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState);
        expect(store.get()).toEqual(initialState);
    });

    it("should update the state using set", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState);
        store.set({ count: 1 });
        expect(store.get().count).toBe(1);
    });

    it("should reset the state to initial state", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState);
        store.set({ count: 1 });
        store.reset();
        expect(store.get()).toEqual(initialState);
    });

    it("should notify subscribers on state change", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState);
        const listener = vi.fn();
        store.subscribe(listener);
        store.set({ count: 1 });
        expect(listener).toHaveBeenCalled();
    });

    it("should unsubscribe listeners correctly", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState);
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);
        unsubscribe();
        store.set({ count: 1 });
        expect(listener).not.toHaveBeenCalled();
    });

    it("should create actions if provided", () => {
        const initialState = { count: 0 };
        const store = createStore(initialState, (set, get) => ({
            increment: () => set((state) => ({ count: state.count + 1 })),
            decrement: () => set((state) => ({ count: state.count - 1 })),
            getCount: () => get().count,
        }));
        store.actions.increment();
        expect(store.actions.getCount()).toBe(1);
        store.actions.decrement();
        expect(store.actions.getCount()).toBe(0);
    });
});
