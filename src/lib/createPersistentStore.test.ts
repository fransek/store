import superjson from "superjson";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPersistentStore } from "./createPersistentStore";

describe("createPersistentStore", () => {
  const key = "test";
  const initialState = { count: 0 };
  const listener = vi.fn();
  const initKey = `init_${key}`;
  const storeKey = `store_${key}`;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should initialize with the given initial state", () => {
    const store = createPersistentStore(key, initialState);
    expect(store.get()).toEqual(initialState);
  });

  it("should persist state changes to localStorage", () => {
    const store = createPersistentStore(key, initialState);
    store.subscribe(listener);
    store.set({ count: 1 });
    const storedState = localStorage.getItem(storeKey);
    expect(storedState).toBe(superjson.stringify({ count: 1 }));
  });

  it("should load state from localStorage if available", () => {
    localStorage.setItem(initKey, superjson.stringify({ count: 0 }));
    localStorage.setItem(storeKey, superjson.stringify({ count: 2 }));
    const store = createPersistentStore(key, initialState);
    expect(store.get()).toEqual({ count: 0 });
    store.subscribe(listener);
    expect(store.get()).toEqual({ count: 2 });
  });

  it("should load state from sessionStorage if available", () => {
    sessionStorage.setItem(initKey, superjson.stringify({ count: 0 }));
    sessionStorage.setItem(storeKey, superjson.stringify({ count: 2 }));
    const store = createPersistentStore(key, initialState, null, {
      storage: "session",
    });
    store.subscribe(listener);
    expect(store.get()).toEqual({ count: 2 });
  });

  it("should update state when window gains focus", () => {
    const store = createPersistentStore(key, initialState);
    store.subscribe(listener);
    store.set({ count: 1 });
    localStorage.setItem(storeKey, superjson.stringify({ count: 2 }));
    window.dispatchEvent(new Event("focus"));
    expect(store.get()).toEqual({ count: 2 });
  });

  it("should remove event listeners on detach", () => {
    const store = createPersistentStore(key, initialState);
    const unsubscribe = store.subscribe(listener);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const removeStoreListenerSpy = vi.spyOn(store, "removeEventListener");
    unsubscribe();
    expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    expect(removeStoreListenerSpy).toHaveBeenCalledOnce();
  });

  it("should not persist state changes to sessionStorage", () => {
    const store = createPersistentStore(key, initialState);
    store.subscribe(listener);
    store.set({ count: 1 });
    const storedState = sessionStorage.getItem(storeKey);
    expect(storedState).toBeNull();
  });
});
