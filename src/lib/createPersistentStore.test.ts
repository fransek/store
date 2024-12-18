import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPersistentStore } from "./createPersistentStore";
import superjson from "superjson";

describe("createPersistentStore", () => {
  const key = "test";
  const initialState = { count: 0 };
  const listener = vi.fn();
  const listener2 = vi.fn();
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
    expect(storedState).toBe(JSON.stringify({ count: 1 }));
  });

  it("should load state from localStorage if available", () => {
    localStorage.setItem(initKey, JSON.stringify({ count: 0 }));
    localStorage.setItem(storeKey, JSON.stringify({ count: 1 }));
    const store = createPersistentStore(key, initialState);
    expect(store.get()).toEqual({ count: 0 });
    store.subscribe(listener);
    expect(store.get()).toEqual({ count: 1 });
  });

  it("should load state from sessionStorage if available", () => {
    sessionStorage.setItem(initKey, JSON.stringify({ count: 0 }));
    sessionStorage.setItem(storeKey, JSON.stringify({ count: 2 }));
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
    localStorage.setItem(storeKey, JSON.stringify({ count: 2 }));
    window.dispatchEvent(new Event("focus"));
    expect(store.get()).toEqual({ count: 2 });
  });

  it("should add and remove event listeners once", () => {
    const store = createPersistentStore(key, initialState);
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const addStoreListenerSpy = vi.spyOn(store, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const removeStoreListenerSpy = vi.spyOn(store, "removeEventListener");

    const unsubscribe = store.subscribe(listener);
    const unsubscribe2 = store.subscribe(listener2);
    store.set({ count: 1 });
    unsubscribe();
    unsubscribe2();

    expect(addEventListenerSpy).toHaveBeenCalledOnce();
    expect(addStoreListenerSpy).toHaveBeenCalledOnce();
    expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    expect(removeStoreListenerSpy).toHaveBeenCalledOnce();
  });

  it("should use custom serializer", () => {
    createPersistentStore(key, initialState, null, {
      serializer: superjson,
    });
    const initState = localStorage.getItem(initKey);
    expect(initState).toBe(superjson.stringify(initialState));
  });
});
