var initialState = {
  settings: {
    defaultOpen: false,
    hideUntilHover: false,
    position: "bottom-right",
    panelLocation: "bottom",
    openHotkey: ["Control", "~"],
    inspectHotkey: ["Shift", "CtrlOrMeta"],
    requireUrlFlag: false,
    urlFlag: "tanstack-devtools",
    theme: typeof window !== "undefined" && typeof window.matchMedia !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    triggerHidden: false,
    customTrigger: void 0
  }
};
var TanStackDevtoolsCore = class {
  #config = {
    ...initialState.settings
  };
  #plugins = [];
  #isMounted = false;
  #dispose;
  #Component;
  #eventBus;
  #eventBusConfig;
  #setPlugins;
  constructor(init) {
    this.#plugins = init.plugins || [];
    this.#eventBusConfig = init.eventBusConfig;
    this.#config = {
      ...this.#config,
      ...init.config
    };
  }
  mount(el) {
    return;
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error("Devtools is not mounted");
    }
    this.#eventBus?.stop();
    this.#dispose?.();
    this.#isMounted = false;
  }
  setConfig(config) {
    this.#config = {
      ...this.#config,
      ...config
    };
    if (config.plugins) {
      this.#plugins = config.plugins;
      if (this.#isMounted && this.#setPlugins) {
        this.#setPlugins(config.plugins);
      }
    }
  }
};
export {
  TanStackDevtoolsCore as T
};
