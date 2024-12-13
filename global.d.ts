declare global {
  interface Window {
    __store_listeners?: Set<string>;
  }
}

export {};
