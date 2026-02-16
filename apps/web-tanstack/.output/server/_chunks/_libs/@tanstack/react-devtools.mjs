import { r as reactExports, j as jsxRuntimeExports } from "../react.mjs";
import { T as TanStackDevtoolsCore } from "./devtools.mjs";
import { r as reactDomExports } from "../react-dom.mjs";
const convertRender = (Component, setComponents, e, theme) => {
  const element = typeof Component === "function" ? Component(e, theme) : Component;
  setComponents((prev) => ({
    ...prev,
    [e.getAttribute("id")]: element
  }));
};
const convertTrigger = (Component, setComponent, e, props) => {
  const element = typeof Component === "function" ? Component(e, props) : Component;
  setComponent(element);
};
const TanStackDevtools$1 = ({
  plugins,
  config,
  eventBusConfig
}) => {
  const devToolRef = reactExports.useRef(null);
  const [pluginContainers, setPluginContainers] = reactExports.useState({});
  const [titleContainers, setTitleContainers] = reactExports.useState({});
  const [triggerContainer, setTriggerContainer] = reactExports.useState(
    null
  );
  const [PluginComponents, setPluginComponents] = reactExports.useState({});
  const [TitleComponents, setTitleComponents] = reactExports.useState({});
  const [TriggerComponent, setTriggerComponent] = reactExports.useState(
    null
  );
  const pluginsMap = reactExports.useMemo(
    () => plugins?.map((plugin) => {
      return {
        ...plugin,
        name: typeof plugin.name === "string" ? plugin.name : (e, theme) => {
          const id = e.getAttribute("id");
          const target = e.ownerDocument.getElementById(id);
          if (target) {
            setTitleContainers((prev) => ({
              ...prev,
              [id]: e
            }));
          }
          convertRender(
            plugin.name,
            setTitleComponents,
            e,
            theme
          );
        },
        render: (e, theme) => {
          const id = e.getAttribute("id");
          const target = e.ownerDocument.getElementById(id);
          if (target) {
            setPluginContainers((prev) => ({
              ...prev,
              [id]: e
            }));
          }
          convertRender(plugin.render, setPluginComponents, e, theme);
        }
      };
    }) ?? [],
    [plugins]
  );
  const [devtools] = reactExports.useState(() => {
    const { customTrigger, ...coreConfig } = config || {};
    return new TanStackDevtoolsCore({
      config: {
        ...coreConfig,
        customTrigger: customTrigger ? (el, props) => {
          setTriggerContainer(el);
          convertTrigger(customTrigger, setTriggerComponent, el, props);
        } : void 0
      },
      eventBusConfig,
      plugins: pluginsMap
    });
  });
  reactExports.useEffect(() => {
    devtools.setConfig({
      plugins: pluginsMap
    });
  }, [devtools, pluginsMap]);
  reactExports.useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current);
    }
    return () => devtools.unmount();
  }, [devtools]);
  const hasPlugins = Object.values(pluginContainers).length > 0 && Object.values(PluginComponents).length > 0;
  const hasTitles = Object.values(titleContainers).length > 0 && Object.values(TitleComponents).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute" }, ref: devToolRef }),
    hasPlugins ? Object.entries(pluginContainers).map(
      ([key, pluginContainer]) => reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: PluginComponents[key] }), pluginContainer)
    ) : null,
    hasTitles ? Object.entries(titleContainers).map(
      ([key, titleContainer]) => reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: TitleComponents[key] }), titleContainer)
    ) : null,
    triggerContainer && TriggerComponent ? reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: TriggerComponent }), triggerContainer) : null
  ] });
};
const TanStackDevtools = TanStackDevtools$1;
export {
  TanStackDevtools as T
};
